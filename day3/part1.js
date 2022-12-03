const fs = require('fs');
const path = require('path');

const rucksackSeparator = '\n';

const getRucksacks = data => data
    .trim()
    .split(rucksackSeparator)
    .map(rucksackItems => rucksackItems.trim())
    .map(rucksackItems => [
        rucksackItems.substring(0, rucksackItems.length / 2),
        rucksackItems.substring(rucksackItems.length / 2, rucksackItems.length),
    ]);

const getItemPriority = item => {
    if (item.match(/[a-z]/)) {
        return item.charCodeAt(0) - ('a'.charCodeAt(0) - 1);
    } else if (item.match(/[A-Z]/)) {
        return item.charCodeAt(0) - ('A'.charCodeAt(0) - 1) + 26;
    }

    throw 'Invalid item in rucksack';
};

const getUniqueItems = arr => Array.from((new Set(arr)).values());

const getSumOfArr = arr => arr.reduce((acc, curr) => acc + curr, 0);

const findCommonLetterPriority = (string1, string2) => {
    const priorities1 = string1.split('').map(getItemPriority);
    const priorities2 = string2.split('').map(getItemPriority);

    return getSumOfArr([...getUniqueItems(priorities1), ...getUniqueItems(priorities2)]) -
        getSumOfArr(getUniqueItems([...priorities1, ...priorities2]));
};

const getSumOfRepeatedItems = data => {
    const rucksacks = getRucksacks(data);

    const repeatedItemsPriorities =
        rucksacks.map(
            ([compartment1, compartment2]) => findCommonLetterPriority(compartment1, compartment2)
        );

    const repeatedItemsPrioritiesSum = getSumOfArr(repeatedItemsPriorities);

    return repeatedItemsPrioritiesSum;
}


const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const repeatedItemPrioritiesSum = getSumOfRepeatedItems(data);

console.log(repeatedItemPrioritiesSum);
