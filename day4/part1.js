const fs = require('fs');
const path = require('path');

const pairsSeparator = '\n';
const elvesSeparator = ',';
const intervalsSeparator = '-';

const getPairs = data => data.trim().split(pairsSeparator);
const parsePair = pair => pair.split(elvesSeparator);
const parseInterval = interval => interval.split(intervalsSeparator).map(edge => parseInt(edge));

const isPairFullyContained = ([[from1, to1], [from2], [to2]]) =>
    (from1 >= from2 && to1 <= to2) || (from2 >= from1 && to2 <= to1);

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const getFullyContainedPairsCount = data => {
    const parsedData = getPairs(data).map(parsePair).map(intervals => intervals.map(parseInterval));

    const fullContainedPairsCount =
        parsedData.reduce((acc, curr) => acc + (isPairFullyContained(curr) ? 1 : 0),0);

    return fullContainedPairsCount;
}

const fullContainedPairsCount = getFullyContainedPairsCount(data);


console.log(fullContainedPairsCount);
