const fs = require('fs');
const path = require('path');

class Cave {
    constructor() {
        this.rocksSet = new Set();
        this.maxHeight = 0;
    }

    checkCoords(x, y) {
        return x >= 0 && x <= 6 && y >= 0 && !this.rocksSet.has(`${x}-${y}`);
    }

    applyRock(rock) {
        rock.coords.forEach(([x, y]) => {
           this.rocksSet.add(`${x}-${y}`);

           this.maxHeight = Math.max(this.maxHeight, y + 1);
        });
    }

    print() {
        let result = ''
        for(let y = this.maxHeight; y >= 0 ; y--) {
            result += '\n';

            for (let x = 0; x < 7; x++) {
                if (this.rocksSet.has(`${x}-${y}`)) {
                    result += '#';
                } else {
                    result += '.';
                }
            }
        }

        console.log(result);
    }
}

class Rock {
    constructor(coords, cave) {
        this.coords = coords.map(([x, y]) => [x + 2, y + cave.maxHeight + 3]);
        this.cave = cave;
    }

    move(dir) {
        // console.log(dir);
        const newCoords = dir === '<' ? this.coords.map(([x, y]) => [x - 1, y]) : this.coords.map(([x, y]) => [x + 1, y]);

        // console.log(newCoords);

        const canMoveSide = newCoords.every(([x, y]) => this.cave.checkCoords(x, y));

        // console.log(canMoveSide);

        const downCoords = (canMoveSide ? newCoords : this.coords).map(([x, y]) => [x, y - 1]);

        const canMoveDown = downCoords.every(([x, y]) => this.cave.checkCoords(x, y));

        // console.log(downCoords)



        if (!canMoveDown) {
            if (canMoveSide) {
                this.coords = newCoords;
            }

            this.cave.applyRock(this);

            return false;
        }

        this.coords = downCoords;

        return true;
    }
}

class Rock1 extends Rock {
    constructor(cave) {
        super([[0, 0], [1, 0], [2, 0], [3, 0]], cave);
    }
}

class Rock2 extends Rock {
    constructor(cave) {
        super([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], cave);
    }
}

class Rock3 extends Rock {
    constructor(cave) {
        super([[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], cave);
    }
}

class Rock4 extends Rock {
    constructor(cave) {
        super([[0, 0], [0, 1], [0, 2], [0, 3]], cave);
    }
}


class Rock5 extends Rock {
    constructor(cave) {
        super([[0, 0], [1, 0], [0, 1], [1, 1]], cave);
    }
}

const getRocksHeight = (data, rocksCount) => {
    const jets = data.trim();
    const jetsCount = jets.length;

    console.log('jc', jetsCount * 5);

    const cave = new Cave();

    const getRock = (counter) => {
        switch (counter % 5) {
            case 0:
                return new Rock1(cave);
                break;
            case 1:
                return new Rock2(cave);
                break;
            case 2:
                return new Rock3(cave);
                break;
            case 3:
                return new Rock4(cave);
                break;
            case 4:
                return new Rock5(cave);
                break;
        }
    }

    let currentJetIndex = 0;

    for(let i = 0; i < rocksCount; i++) {
        const rock = getRock(i);

        let stop = false;

        while(!stop) {
            const currentJet = jets[currentJetIndex % jetsCount];

            stop = !rock.move(currentJet);

            currentJetIndex++;
        }

    }

    return cave.maxHeight;
};

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const h = getRocksHeight(data, 2022);

console.log(h);
