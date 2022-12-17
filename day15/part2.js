const fs = require('fs');
const path = require('path');

const lineSeparator = '\n';

const getDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

class Sensor {
    constructor(sensorX, sensorY, beaconX, beaconY) {
        this.sensorX = sensorX;
        this.sensorY = sensorY;

        this.radius = getDistance(sensorX, sensorY, beaconX, beaconY);
    }

    getUnavailableForBeaconByY(y) {
        const diff = Math.abs(this.sensorY - y);

        if (diff > this.radius) {
            return [];
        }

        const from = this.sensorX - (this.radius - diff);
        const to = this.sensorX + (this.radius - diff);

        return [from, to];
    }
}

const getIntervalBreakPoint = (intervals, limit) => {
    const opens = intervals.map(([val]) => Math.max(0, Math.min(val, limit))).filter(val => val >= 0 && val <= limit).map(val => [val, 1]);
    const closes = intervals.map(([, val]) => Math.max(0, Math.min(val, limit))).filter(val => val >= 0 && val <= limit).map(val => [val, -1]);

    const merged = [...opens, ...closes].sort(([val1], [val2]) => val1 - val2);

    let counter = 0;
    let index = 0;
    let result = null;

    do {
        counter += merged[index][1];

        if (counter === 0) {
            result = merged[index][0] + 1;
        }

        index++;
    } while (result === null && index < merged.length - 1);

    return result;
}

const getBeaconFreq = (data, limit) => {
    const sensors = data.trim().split(lineSeparator).map(line => {
        const [sensorX, sensorY, beaconX, beaconY] = line.match(/-?\d{1,}/g).map(val => parseInt(val.trim()));

        return new Sensor(sensorX, sensorY, beaconX, beaconY);
    });

    let beaconCoords = null;
    let currentY = 0;

    while (beaconCoords === null && currentY <= limit) {
        const line = sensors.map(sensor => sensor.getUnavailableForBeaconByY(currentY)).filter(interval => interval.length);

        const lineBreakpoint = getIntervalBreakPoint(line, limit);

        if (lineBreakpoint !== null) {
            beaconCoords = [lineBreakpoint, currentY];
        }

        currentY++;
    }

    if (beaconCoords) {
        const [beaconX, beaconY] = beaconCoords;

        return beaconX * 4000000 + beaconY;
    }

    return null;
}

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const freq = getBeaconFreq(data, 4000000);

console.log(freq);


