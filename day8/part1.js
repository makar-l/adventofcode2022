const fs = require('fs');
const path = require('path');

const lineSeparator = '\n';

const getVisibleFromLeftTreeIndexes = trees => {
    const [indexes] = trees.reduce(
        ([result, currentMax], curr, index) =>
            curr > currentMax ? [[...result, index], curr] : [result, currentMax],
        [[], -1]
    );

    return indexes;
};

const getVisibleFromLeftOrRightIndexes = treesArr => {
    const lineLength = treesArr.length;

    const visibleFromLeft =
        getVisibleFromLeftTreeIndexes(treesArr);

    const visibleFromRight =
        getVisibleFromLeftTreeIndexes(treesArr.reverse())
            .map(index => lineLength - index - 1);

    return Array.from(new Set([...visibleFromLeft, ...visibleFromRight]).values());
};

const getVisibleTreesCount = data => {
    const lines = data.trim().split(lineSeparator);

    const visibleInLine = lines.reduce((acc, currentLine, currentLineIndex) => {
        const lineArr = currentLine.trim().split('');

        return [...acc, ...getVisibleFromLeftOrRightIndexes(lineArr).map(treeIndex => `${currentLineIndex}-${treeIndex}`)];
    }, []);

    const cols = lines[0].trim().split('').reduce((acc, _, currentColIndex) => {
        return [...acc, lines.map(line => line[currentColIndex])];
    }, []);

    const visibleInCols =  cols.reduce((acc, currentColArr, currentColIndex) => {
        return [
            ...acc,
            ...getVisibleFromLeftOrRightIndexes(currentColArr)
                .map(treeIndex => `${treeIndex}-${currentColIndex}`)
        ];
    }, []);

    return Array.from(new Set([...visibleInLine, ...visibleInCols]).values()).length;
};

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const visibleTreesCount = getVisibleTreesCount(data);

console.log(visibleTreesCount);

