const fs = require('fs');
const path = require('path');

const gamesSeparator = '\n';
const choiceSeparator = ' ';

const getGamesArr = data =>
    data.trim()
        .split(gamesSeparator)
        .map(game => game.trim().split(choiceSeparator));

const getScoresForShape = shape => {
    const score = {
        X: 1,
        Y: 2,
        Z: 3,
    }[shape];

    if (score === undefined) {
        throw 'Invalid shape';
    }

    return score;
};

const getScoresForGame = (their, our) => {
    const drawMap = {
        X: 'A',
        Y: 'B',
        Z: 'C',
    };

    const winMap = {
        X: 'C',
        Y: 'A',
        Z: 'B',
    }

    if (drawMap[our] === their) {
        return 3;
    }

    if (winMap[our] === their) {
        return 6;
    }

    return 0;
};

const getTotalScores = data => {
    const gamesArray = getGamesArr(data);

    const total = gamesArray.reduce(
        (acc, [their, our]) => acc + getScoresForShape(our) + getScoresForGame(their, our),
        0
    );

    return total;
};

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const totalScores = getTotalScores(data);

console.log(totalScores);
