const fs = require('fs');
const path = require('path');

const lineSeparator = '\n';

const getDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

class Sensor {
    constructor(sensorX, sensorY, beaconX, beaconY) {
        this.sensorX = sensorX;
        this.sensorY = sensorY;
        this.beaconX = beaconX;
        this.beaconY = beaconY;

        this.radius = getDistance(sensorX, sensorY, beaconX, beaconY);
    }

    getUnavailableForBeaconByY(y) {
        const result = [];
        const diff = Math.abs(this.sensorY - y);

        if (diff > this.radius) {
            return [];
        }

        const from = this.sensorX - (this.radius - diff);
        const to = this.sensorX + (this.radius - diff);

        for (let i = from; i <= to; i++) {
            if (y !== this.beaconY || i !== this.beaconX) {
                result.push(i);
            }
        }

        return result;
    }
}

const getImpossibleBeaconsCountInRow = (data, rowIndex) => {
    const sensors = data.trim().split(lineSeparator).map(line => {
        const [sensorX, sensorY, beaconX, beaconY] = line.match(/-?\d{1,}/g).map(val => parseInt(val.trim()));

        return new Sensor(sensorX, sensorY, beaconX, beaconY);
    });

    return new Set(sensors.reduce((acc, sensor) => [...acc, ...sensor.getUnavailableForBeaconByY(rowIndex)], [])).size;
};

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const impossibleBeaconsCount = getImpossibleBeaconsCountInRow(data, 2000000);

console.log(impossibleBeaconsCount);

