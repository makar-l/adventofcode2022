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
        this.cycles = [];
        this.currentState = 1;
    }

    runCommand(command) {
        const [cycles, nextValue] = command.makeCycles(this.currentState);

        this.currentState = nextValue;
        this.cycles = [...this.cycles, ...cycles];
    }

    getSignalStrength(cycleNumber) {
        const cycle = this.cycles[cycleNumber - 1];

        if (!cycle) {
            throw new Error('Invalid cycle index');
        }

        return cycleNumber * cycle;
    }
}


const getSignalStrengthsSum = (data, cycleNums) => {
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

    const strengthsSum = cycleNums.reduce((acc, curr) => acc + tube.getSignalStrength(curr), 0);

    return strengthsSum;
};
const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const signalStrengthsSum = getSignalStrengthsSum(data, [20, 60, 100, 140, 180, 220]);

console.log(signalStrengthsSum);
