const fs = require('fs');
const path = require('path');

const rucksackSeparator = '\n';

const getGroups = data =>
    data.trim().match(/[a-zA-Z]*\n[a-zA-Z]*\n[a-zA-Z]*\n/g);

const getRucksacks = data => data
    .trim()
    .split(rucksackSeparator)
    .map(rucksackItems => rucksackItems.trim());

const getItemPriority = item => {
    if (item.match(/[a-z]/)) {
        return item.charCodeAt(0) - ('a'.charCodeAt(0) - 1);
    } else if (item.match(/[A-Z]/)) {
        return item.charCodeAt(0) - ('A'.charCodeAt(0) - 1) + 26;
    }

    throw 'Invalid item in rucksack';
};

const getSumOfArr = arr => arr.reduce((acc, curr) => acc + curr, 0);

const findCommonLetterPriority = (rucksack1, rucksack2, rucksack3) => {
    const items1 = rucksack1.split('');
    const items2 = rucksack2.split('');
    const items3 = rucksack3.split('');

    const set2 = new Set(items2);
    const set3 = new Set(items3);

    const commonItem = items1.find(item => set2.has(item) && set3.has(item));

    return getItemPriority(commonItem);
};

const getSumOfGroupCommonItems = data => {
    const groups = getGroups(`${data}\\n`).map(getRucksacks);

    const groupCommonItemsPriorities =
        groups.map(
            ([rucksack1, rucksack2, rucksack3]) => findCommonLetterPriority(rucksack1, rucksack2, rucksack3)
        );

    const groupCommonItemsPrioritiesSum = getSumOfArr(groupCommonItemsPriorities);

    return groupCommonItemsPrioritiesSum;
}


const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const groupCommonItemsSum = getSumOfGroupCommonItems(data);

console.log(groupCommonItemsSum);
