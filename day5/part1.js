const fs = require('fs');
const path = require('path');

class Node {
    constructor(value, next) {
        this.value = value;
        this.next = next || null;
    }
}

class Stack {
    constructor(initialArr) {
        this.head = initialArr.reverse().reduce((acc, curr) => new Node(curr, acc), null);
    }

    push(value) {
        this.head = new Node(value, this.head);
    }

    pop() {
        if (this.head) {
            const value = this.head.value;

            this.head = this.head.next;

            return value;
        }

        return null;
    }

    pick() {
        return this.head.value;
    }
}

const partsSeparator = '\n\n';
const layersSeparator = '\n';
const stepsSeparator = '\n';

const getInitialStateAndScript = data => {
    return data.split(partsSeparator);
};

const parseInitialState = initialState => {
    const lines = initialState.split(layersSeparator).slice(0, -1);
    const lineLength = lines[0].length;
    const colsCount = (lineLength + 1) / 4;

    const cols = [];

    for (let col = 0; col < colsCount; col++) {
        for (let line = 0; line < lines.length; line++) {
            if (line === 0) {
                cols.push([]);
            }

            const crate = lines[line][col * 4 + 1];

            if (crate !== ' ') {
                cols[col].push(crate);
            }
        }
    }

    return cols.map(col => new Stack(col));
};

const getScriptSteps = script => {
    const stepLines = script.trim().split(stepsSeparator);

    const steps = stepLines.map(line => {
        const [count, from, to] = line.match(/[\d]{1,}/g).map(num => parseInt(num));

        return {
            count, from, to,
        }
    });

    return steps;
}

const moveCrate = (count, from, to, stacks) => {
    const fromIndex = from - 1;
    const toIndex = to - 1;
    for (let i = 0; i < count; i++) {
        const value = stacks[fromIndex].pop();

        if (value) {
            stacks[toIndex].push(value);
        }
    }
}

const getTopCrates = data => {
    const [initialState, script] = getInitialStateAndScript(data);

    const steps = getScriptSteps(script);

    const stacks = parseInitialState(initialState);

    steps.forEach(({count, from, to}) => moveCrate(count, from, to, stacks));

    const topCrates = stacks.map(stack => stack.pick()).join('');

    return topCrates;
};

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const topCrates = getTopCrates(data);

console.log(topCrates);
