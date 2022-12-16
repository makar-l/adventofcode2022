const fs = require('fs');
const path = require('path');

const lineSeparator = '\n';
const coordsPairSeparator = ' -> ';
const coordsSeparator = ',';
const startX = 500;

const getMinMaxXY = coordsArr => coordsArr.reduce(([minY, minX, maxY, maxX], [y, x]) => [
    Math.min(y, minY), Math.min(x, minX), Math.max(y, maxY), Math.max(x, maxX)
], [Infinity, Infinity, 0, 0]);

const addRocksToCave = (coordsArr, cave) => {
    for(let i = 1; i < coordsArr.length; i++) {
        const [fromX, fromY] = coordsArr[i - 1];
        const [toX, toY] = coordsArr[i];

        const [minX, maxX] = fromX < toX ? [fromX, toX] : [toX, fromX];
        const [minY, maxY] = fromY < toY ? [fromY, toY] : [toY, fromY];

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                cave[y][x] = '#';
            }
        }
    }
}

const checkPoint = (x, y, cave) => {
    const point = cave[y] && cave[y][x];

    if (point === undefined) {
        return -1;
    }

    if (point === '.') {
        return 1;
    }

    return 0;
};

const sandUnitStep = (x, y, cave) => {
    const possiblePoints = [[x, y + 1], [x - 1, y + 1], [x + 1, y + 1]];

    const actionsForPoints = possiblePoints.map(([x, y]) => checkPoint(x, y, cave));

    const resultIndex = actionsForPoints.findIndex(result => result !== 0);

    if (resultIndex === -1) {
        return [x, y];
    }

    if (actionsForPoints[resultIndex] === 1) {
        const [nextX, nextY] = possiblePoints[resultIndex]

        return sandUnitStep(nextX, nextY, cave);
    }

    return null;
};

const getSandCount = data => {
    const rocks =
        data.trim()
            .split(lineSeparator)
            .map(line =>
                line
                    .trim()
                    .split(coordsPairSeparator)
                    .map(coordsPair => coordsPair.trim().split(coordsSeparator).map(coord => parseInt(coord.trim())))
            );

    const [minX, minY, maxX, maxY] = getMinMaxXY(rocks.reduce((acc, curr) => [...acc, ...curr], []));

    const xOffset = minX;

    const rocksWithOffset = rocks.map(line => line.map(([x, y]) => [x - xOffset, y]));

    const cave = new Array(maxY + 1).fill(null).map(() => new Array(maxX - xOffset + 1).fill('.'));

    rocksWithOffset.forEach(coordsArr => addRocksToCave(coordsArr, cave));

    let stop = false;
    let counter = 0;

    while (!stop) {
        const sandCoords = sandUnitStep(startX - xOffset, 0, cave);

        if (sandCoords !== null) {
            const [sandX, sandY] = sandCoords;

            cave[sandY][sandX] = 'o';

            counter ++;
        } else {
            stop = true;
        }
    }

    return counter;
}

const data = fs.readFileSync(path.join(__dirname,'./input2.txt'), 'utf8');

const sandCount = getSandCount(data);

console.log(sandCount);

