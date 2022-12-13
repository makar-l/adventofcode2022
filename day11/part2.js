const checkValueForTop = (top, value) => {
    if (value < top[top.length - 1]) {
        return top;
    }

    const _top = [...top];

    let buffer = null;

    for (let i = 0; i < _top.length; i++) {
        if (buffer === null && value > _top[i]) {
            buffer = _top[i];

            _top[i] = value;
        } else if (buffer !== null) {
            _top[i] = _top[i] + buffer;
            buffer = _top[i] - buffer;
            _top[i] = _top[i] - buffer;
        }
    }

    return _top;
}

class Monkey {
    constructor(items, operationFn, testFn, trueMonkeyFactory, falseMonkeyFactory) {
        this.items = items;
        this.operationFn = operationFn;
        this.testFn = testFn;
        this.trueMonkeyFactory = trueMonkeyFactory;
        this.falseMonkeyFactory = falseMonkeyFactory;
        this.inspectionsCount = 0;
    }

    throwItems() {
        this.items.forEach(item => {
            const worryLvl = this.operationFn(item) % (2 * 3 * 5 * 7 * 11 * 13 * 17 * 19);

            const testResult = this.testFn(worryLvl);

            const monkey = testResult ? this.trueMonkeyFactory() : this.falseMonkeyFactory();

            monkey.receiveItem(worryLvl);
        });

        this.inspectionsCount += this.items.length;

        this.items = [];
    }


    receiveItem(item) {
        this.items = [...this.items, item];
    }
}

const getMonkeyBusiness = roundsCount => {
    let monkey0, monkey1, monkey2, monkey3, monkey4, monkey5, monkey6, monkey7 = null;

    monkey0 = new Monkey(
        [89, 74], worryLvl => worryLvl * 5, worryLvl => worryLvl % 17 === 0, () => monkey4, () => monkey7
    );

    monkey1 = new Monkey(
        [75, 69, 87, 57, 84, 90, 66, 50], worryLvl => worryLvl + 3, worryLvl => worryLvl % 7 === 0, () => monkey3, () => monkey2
    );

    monkey2 = new Monkey(
        [55], worryLvl => worryLvl + 7, worryLvl => worryLvl % 13 === 0, () => monkey0, () => monkey7
    );

    monkey3 = new Monkey(
        [69, 82, 69, 56, 68], worryLvl => worryLvl + 5, worryLvl => worryLvl % 2 === 0, () => monkey0, () => monkey2
    );

    monkey4 = new Monkey(
        [72, 97, 50], worryLvl => worryLvl + 2, worryLvl => worryLvl % 19 === 0, () => monkey6, () => monkey5
    );

    monkey5 = new Monkey(
        [90, 84, 56, 92, 91, 91], worryLvl => worryLvl * 19, worryLvl => worryLvl % 3 === 0, () => monkey6, () => monkey1
    );

    monkey6 = new Monkey(
        [63, 93, 55, 53], worryLvl => worryLvl * worryLvl, worryLvl => worryLvl % 5 === 0, () => monkey3, () => monkey1
    );

    monkey7 = new Monkey(
        [50, 61, 52, 58, 86, 68, 97], worryLvl => worryLvl + 4, worryLvl => worryLvl % 11 === 0, () => monkey5, () => monkey4
    );

    const monkeys = [monkey0, monkey1, monkey2, monkey3, monkey4, monkey5, monkey6, monkey7];

    const round = () => {
        monkeys.forEach(monkey => monkey.throwItems());
    };

    for (let i = 0; i < roundsCount; i++) {
        round();
    }

    const topTwoMonkeys = monkeys.map(monkey => monkey.inspectionsCount).reduce(checkValueForTop, [0, 0]);

    return topTwoMonkeys[0] * topTwoMonkeys[1];
};

const monkeyBusiness = getMonkeyBusiness(10000);

console.log(monkeyBusiness);
