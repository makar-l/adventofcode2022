const fs = require('fs');
const path = require('path');

const lineSeparator = '\n';
const linePartsSeparator = ' ';

class Rope {
    constructor() {
        this.head = [0, 0];
        this.tail = [0, 0];
        this.visitedPoints = new Set(['0:0']);
    }

    move(direction) {
        const xDirectionsMap = {
            R: 1,
            L: -1,
        };

        const yDirectionsMap = {
            U: 1,
            D: -1,
        };

        const [tailX, tailY] = this.tail;
        const [headX, headY] = this.head;

        const nextHeadX = headX + (xDirectionsMap[direction] || 0);
        const nextHeadY = headY + (yDirectionsMap[direction] || 0);

        this.head = [nextHeadX, nextHeadY];

        const xDistance = nextHeadX - tailX;
        const yDistance = nextHeadY - tailY;

        if (Math.abs(xDistance) <= 1 && Math.abs(yDistance) <= 1) {
            return;
        }

        this.tail = [headX, headY];

        this.visitedPoints.add(`${headX}:${headY}`);
    }
}

const getVisitedPositionsCount = data => {
    const commands = data.trim().split(lineSeparator)
        .map(commandLine => commandLine.trim().split(linePartsSeparator));

    const rope = new Rope();

    commands.forEach(([direction, count]) => {
        for(let i = 0; i < count; i++) {
            rope.move(direction);
        }
    });

    return rope.visitedPoints.size;
};

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const visitedPointsCount = getVisitedPositionsCount(data);

console.log(visitedPointsCount);
