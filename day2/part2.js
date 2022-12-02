const fs = require('fs');
const path = require('path');

const gamesSeparator = '\n';
const choiceSeparator = ' ';

const getGamesArr = data =>
    data.trim()
        .split(gamesSeparator)
        .map(game => game.trim().split(choiceSeparator));

const winMap = {
    A: 'C',
    B: 'A',
    C: 'B',
};

const looseMap = Object.fromEntries(
    Object.entries(winMap).map(([key, value]) => [value, key]),
);

const getShapeByOpponentShapeAndResult = (opponentShape, result) => {
    if (result === 'Y') {
        return opponentShape;
    }

    return result === 'X' ? winMap[opponentShape] : looseMap[opponentShape];
};

const getScoresForShape = shape => {
    const score = {
        A: 1,
        B: 2,
        C: 3,
    }[shape];

    if (score === undefined) {
        throw 'Invalid shape';
    }

    return score;
};

const getScoresForGame = result => {
    const resultsMap = {
      X: 0,
      Y: 3,
      Z: 6,
    };

    const resultScore = resultsMap[result];

    if (resultScore === undefined) {
        throw 'Invalid result';
    }

    return resultScore;
};

const getTotalScores = data => {
    const gamesArray = getGamesArr(data);

    const total = gamesArray.reduce(
        (acc, [their, result]) => {
            const ourShape = getShapeByOpponentShapeAndResult(their, result);

            return acc + getScoresForShape(ourShape) + getScoresForGame(result)
        }, 0
    );

    return total;
};

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const totalScores = getTotalScores(data);

console.log(totalScores);
