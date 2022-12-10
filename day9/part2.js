const fs = require('fs');
const path = require('path');

const lineSeparator = '\n';
const linePartsSeparator = ' ';

class Knot {
    constructor(next) {
        this.x = 0;
        this.y = 0;
        this.next = next || null;
    }

    move(direction) {
        const directionsMap = {
            U: [0, 1],
            UR: [1, 1],
            R: [1, 0],
            DR: [1, -1],
            D: [0, -1],
            DL: [-1, -1],
            L: [-1, 0],
            UL: [-1, 1],
        };

        const [xOffset, yOffset] = directionsMap[direction];

        this.x = this.x + xOffset;
        this.y = this.y + yOffset;

        if (this.next) {
            const xDistance = this.x - this.next.x;
            const yDistance = this.y - this.next.y;

            if (Math.abs(xDistance) <= 1 && Math.abs(yDistance) <= 1) {
                return;
            }

            const yDir = yDistance === 0 ? '' : (yDistance > 0 ? 'U' : 'D');
            const xDir = xDistance === 0 ? '' : (xDistance > 0 ? 'R' : 'L');

            const dir = `${yDir}${xDir}`;

            if (dir) {
                this.next.move(dir);
            }
        }
    }
}

class MemoryKnot extends Knot {
    constructor(x, y, next) {
        super(x, y, next);

        this.visitedPoints = new Set([`${x}:${y}`]);
    }

    move(direction) {
        super.move(direction);

        this.visitedPoints.add(`${this.x}:${this.y}`);
    }
}


const getVisitedPositionsCount = (data, knotsCount) => {
    const commands = data.trim().split(lineSeparator)
        .map(commandLine => commandLine.trim().split(linePartsSeparator));

    const tail = new MemoryKnot(0, 0, null);

    const knotsCountArr = new Array(knotsCount - 1).fill(null);

    const head = knotsCountArr.reduce((acc) => new Knot(acc), tail);

    commands.forEach(([direction, count]) => {
        for(let i = 0; i < count; i++) {
            head.move(direction);
        }
    });

    return tail.visitedPoints.size;
};

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const visitedPointsCount = getVisitedPositionsCount(data, 10);

console.log(visitedPointsCount);
