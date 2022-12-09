const fs = require('fs');
const path = require('path');

const lineSeparator = '\n';

const rotateMatrix = (matrix, back = false) => {
    const result = [];
    for (let i = 0; i < matrix[0].length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            if (j === 0) {
                result.push([]);
            }

            result[result.length - 1].push(matrix[j][i]);
        }
    }

    return back ? result : result.reverse();
};

const getTreesLeftScenicScore = treesArr => {
    const result = [];
    const maximums = {};

    for (let i = 0; i < treesArr.length; i++) {
        const currentHeight = treesArr[i];

        result.push(i - (maximums[currentHeight] || 0));

        for (let h = 0; h <= currentHeight; h++) {
            maximums[h] = i;
        }
    }

    return result;
};

const getMaxScenicScore = data => {
    const lines = data.trim().split(lineSeparator);

    const treesMatrix = lines.map(lineStr => lineStr.trim().split(''));

    const linesLeftScores = treesMatrix.map(treesArr => getTreesLeftScenicScore(treesArr));

    const linesRightScores = treesMatrix.map(treesArr => getTreesLeftScenicScore(treesArr.reverse()).reverse());

    const rotatedTreesMatrix = rotateMatrix(treesMatrix);

    const colsLeftScores = rotatedTreesMatrix.map(treesArr => getTreesLeftScenicScore(treesArr));

    const colsRightScores = rotatedTreesMatrix.map(treesArr => getTreesLeftScenicScore(treesArr.reverse()).reverse());

    const linesUpScores = rotateMatrix(colsLeftScores, true);

    const linesDownScores = rotateMatrix(colsRightScores, true);

    let result = 0;

    for(let i = 0; i < colsLeftScores.length; i++) {
        for (let j = 0; j < colsLeftScores[0].length; j++) {
            result = Math.max(result, linesLeftScores[i][j] * linesRightScores[i][j] * linesUpScores[i][j] * linesDownScores[i][j]);
        }
    };

    return result;
}

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const maxScenicScores = getMaxScenicScore(data);

console.log(maxScenicScores);
