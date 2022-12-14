const fs = require('fs');
const path = require('path');

const pairsSeparator = '\n\n';
const pairItemsSeparator = '\n';

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

const parseArrayStr = arrayStr => {
    const result = [];
    const stack = new Stack([result]);

    let numsBuffer = [];
    let currentNumDigits = [];

    for (let i = 0; i < arrayStr.length; i++) {
        if ((arrayStr[i] === ',' || arrayStr[i] === ']') && currentNumDigits.length > 0) {
            numsBuffer.push(+currentNumDigits.join(''));
            currentNumDigits = [];
        }

        if (arrayStr[i] === '[' || arrayStr[i] === ']') {
            numsBuffer.forEach(num => stack.pick().push(+num));
            numsBuffer = [];
        }

        if (arrayStr[i] === '[') {
            stack.push([]);
        } else if (arrayStr[i] === ']') {
            const filledArr = stack.pop();

            stack.pick().push(filledArr);
        } else if (!isNaN(+arrayStr[i])) {
            currentNumDigits.push(arrayStr[i]);
        }
    }

    return result[0];
};

const isRightOrder = (item1, item2) => {
    const _item1 = typeof item1 === 'number' ? [item1] : item1;
    const _item2 = typeof item2 === 'number' ? [item2] : item2;

    const minLength = Math.min(_item1.length, _item2.length);

    for (let i = 0; i < minLength; i++) {
        if (typeof _item1[i] === 'number' && typeof _item2[i] === 'number') {
            if (_item1[i] > _item2[i]) {
                return -1;
            }

            if (_item1[i] < _item2[i]) {
                return 1;
            }
        } else {
            const res = isRightOrder(_item1[i], _item2[i]);

            if (res !== 0) {
                return res;
            }
        }
    }

    if (_item1.length < _item2.length) {
        return 1;
    }

    if (_item1.length > _item2.length) {
        return -1;
    }

    return 0;
};

const getCorrectPairIndexesSum = data => {
    const pairs =
        data
            .trim()
            .split(pairsSeparator)
            .map(pairStr => pairStr.trim().split(pairItemsSeparator).map(parseArrayStr));

    return pairs.reduce(
        (acc, [item1, item2], index) =>
            acc + ((isRightOrder(item1, item2) === 1) ? (index + 1) : 0),
        0
    );
};

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const correctPairIndexesSum = getCorrectPairIndexesSum(data);

console.log(correctPairIndexesSum);
