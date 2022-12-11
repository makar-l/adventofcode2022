const fs = require('fs');
const path = require('path');

const lineSeparator = '\n';
const commandPartsSeparator = ' ';

class Command {
    constructor(cyclesCount, transformFunc) {
        this.cyclesCount = cyclesCount;

        this.transformFunc = prevState => transformFunc(prevState);
    }

    makeCycles(stateValue) {
        const duringValues = new Array(this.cyclesCount).fill(stateValue);

        const afterValue = this.transformFunc(stateValue);

        return [duringValues, afterValue];
    }
}

class NoopCommand extends Command {
    constructor() {
        super(1, value => value);
    }
}

class AddXCommand extends Command {
    constructor(increment) {
        super(2, value => value + increment);
    }
}

class Tube {
    constructor() {
        this.pixels = [];
        this.spritePosition = 1;
    }

    runCommand(command) {
        const [cycles, nextValue] = command.makeCycles(this.spritePosition);

        cycles.forEach(spritePos => {
            const pixelIndex = this.pixels.length;
            const lineIndex = Math.floor(pixelIndex / 40);
            const spriteIndex = (spritePos - 1) + 40 * lineIndex;

            if (pixelIndex >= spriteIndex && pixelIndex <= spriteIndex + 2) {
                this.pixels.push('#');
            } else {
                this.pixels.push('.');
            }
        });

        this.spritePosition = nextValue;
    }

    drawScreen() {
        const screenString = this.pixels.reduce(
            (acc, curr, index) =>
                `${acc}${curr}${(index + 1) % 40 === 0 ? '\n' : ''}`,
            ''
        );

        return screenString;
    }
}

const drawScreen = data => {
    const commands = data
        .trim()
        .split(lineSeparator)
        .map(commandLine => commandLine.trim().split(commandPartsSeparator));

    const tube = new Tube();

    commands.forEach(([commandName, param]) => {
        switch (commandName) {
            case 'noop':
                tube.runCommand(new NoopCommand());
                break;
            case 'addx':
                tube.runCommand(new AddXCommand(parseInt(param)));
                break;
        }
    });

    return tube.drawScreen();
};
const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const screen = drawScreen(data);

console.log(screen);
