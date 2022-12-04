const fs = require('fs');
const path = require('path');

const pairsSeparator = '\n';
const elvesSeparator = ',';
const intervalsSeparator = '-';

const getPairs = data => data.trim().split(pairsSeparator);
const parsePair = pair => pair.split(elvesSeparator);
const parseInterval = interval => interval.split(intervalsSeparator).map(edge => parseInt(edge));

const isPairOverlapped = ([[from1, to1], [from2, to2]]) =>
    (from1 >= from2 && from1 <= to2) || (from2 >= from1 && from2 <= to1);

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const getOverlappedPairsCount = data => {
    const parsedData = getPairs(data).map(parsePair).map(intervals => intervals.map(parseInterval));

    const overlappedPairsCount =
        parsedData.reduce((acc, curr) => acc + (isPairOverlapped(curr) ? 1 : 0),0);

    return overlappedPairsCount;
}

const overlappedPairsCount = getOverlappedPairsCount(data);

console.log(overlappedPairsCount);
