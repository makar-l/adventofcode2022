const fs = require('fs');
const path = require('path');

const lineSeparator = '\n';
const lettersSeparator = '';
const start = 'S';
const end = 'E';

const getLetterNumber = letter => (letter.charCodeAt() - 'a'.charCodeAt()) + 1;

const getHeight = letter => {
    return {[start]: getLetterNumber('a'), [end]: getLetterNumber('z')}[letter] || getLetterNumber(letter);
}

const findSmallestStepsCount = data => {
    const areaMatrix = data.trim().split(lineSeparator).map(line => line.trim().split(lettersSeparator));

    const [startLine, startCol] = areaMatrix.reduce((coords, line, lineIndex) => {
        const startIndex = line.findIndex(letter => letter === end);

        return startIndex > -1 ? [lineIndex, startIndex] : coords;
    }, null);

    const iter = (matrix, line, col, stepsCount, memo) => {
        const coords = `${line}:${col}`;

        if (memo[coords] && memo[coords] <= stepsCount) {
            return Infinity;
        }

        memo[coords] = stepsCount;

        const letter = matrix[line][col];

        const height = getHeight(letter);

        if (letter === 'a' || letter === start) {
            return stepsCount;
        }

        const possibleMoves = [[line - 1, col], [line, col + 1], [line + 1, col], [line, col - 1]]
            .filter(
                ([nextLine, nextCol]) => {
                    if (nextLine < 0 || nextLine >= matrix.length || nextCol < 0 || nextCol >= matrix[0].length) {
                        return false;
                    }

                    const nextLetterHeight = getHeight(matrix[nextLine][nextCol]);

                    return nextLetterHeight - height >= -1;
                }
            );

        if (possibleMoves.length === 0) {
            return Infinity;
        }

        return Math.min(...possibleMoves.map(([line, col]) => iter(matrix, line, col, stepsCount + 1, memo)));
    }

    return iter(areaMatrix, startLine, startCol, 0, {});
};

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const stepsCount = findSmallestStepsCount(data);

console.log(stepsCount);
