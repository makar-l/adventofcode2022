const fs = require('fs');
const path = require('path');

const elvesSeparator = '\n\n';
const foodSeparator = '\n';

const getElvesArray = data => data.trim().split(elvesSeparator);

const getSumOfCalories = elf => elf.trim().split(foodSeparator).reduce(
    (acc, curr) => acc + parseInt(curr.trim()),
    0
);

const getMaxCalories = data => {
    const elves = getElvesArray(data);
    const elvesTotalCalories = elves.map(getSumOfCalories);

    return Math.max(...elvesTotalCalories);
}

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const maxCalories = getMaxCalories(data);

console.log(maxCalories);
