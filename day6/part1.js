const fs = require('fs');
const path = require('path');

const findUniqueSequenceEndIndex = (string, intervalLength) => {
    const lettersMap = new Map();
    let intervalStart = 0;
    let pointer = 0;
    let found = false;

    while (pointer < string.length && !found) {
        let lastSameLetterIndex = lettersMap.get(string[pointer]);

        if (lastSameLetterIndex !== undefined && lastSameLetterIndex >= intervalStart) {
            intervalStart = lastSameLetterIndex + 1;
        } else if (pointer - intervalStart + 1 === intervalLength) {
            found = true;
        }

        lettersMap.set(string[pointer], pointer);

        pointer++;
    };

    return found ? pointer : null;
}

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const index = findUniqueSequenceEndIndex(data, 4);

console.log(index);
