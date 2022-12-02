const fs = require('fs');
const path = require('path');

const elvesSeparator = '\n\n';
const foodSeparator = '\n';

const getElvesArray = data => data.trim().split(elvesSeparator);

const getSumOfCalories = elf => elf.trim().split(foodSeparator).reduce(
    (acc, curr) => acc + parseInt(curr.trim()),
    0
);

const checkValueForTop = (top, value) => {
    if (value < top[top.length - 1]) {
        return top;
    }

    const _top = [...top];

    let buffer = null;

    for (let i = 0; i < _top.length; i++) {
        if (buffer === null && value > _top[i]) {
            buffer = _top[i];

            _top[i] = value;
        } else if (buffer !== null) {
            _top[i] = _top[i] + buffer;
            buffer = _top[i] - buffer;
            _top[i] = _top[i] - buffer;
        }
    }

    return _top;
}

const getSumOfArray = array => array.reduce((acc, curr) => acc + curr, 0);

const getTopThreeCaloriesSum = data => {
    const elves = getElvesArray(data);
    const elvesTotalCalories = elves.map(getSumOfCalories);

    const topThree = elvesTotalCalories.reduce(checkValueForTop, [0, 0, 0]);

    return getSumOfArray(topThree);
}

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const topThreeCaloriesSum = getTopThreeCaloriesSum(data);

console.log(topThreeCaloriesSum);
