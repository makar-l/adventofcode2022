const fs = require('fs');
const path = require('path');

const lineSeparator = '\n';

const parseInputData = data => {
    return data.trim().split(lineSeparator).map(line => {
        const [name, ...tunnels] = line.match(/[A-Z]{2}/g);

        const rate = +line.match(/\d+/)[0].trim();

        return {
            name, tunnels, rate,
        }
    });
};

const getDistance = (valveName1, valveName2, valvesMap) => {
    const iter = (currentValve, visited) => {
        if (visited[currentValve.name]) {
            return Infinity;
        }

        if (currentValve.name === valveName2) {
            return Object.values(visited).length;
        }

        return Math.min(
            ...currentValve.tunnels.map(v => iter(valvesMap[v], {...visited, [currentValve.name]: true}))
        );
    }

    return iter(valvesMap[valveName1], {});
};

const getMaxPressure = data => {
    const valvesArr = parseInputData(data);

    const workableValves = valvesArr.filter(({rate}) => rate > 0);

    const valvesMap = Object.fromEntries(valvesArr.map(valve => [valve.name, valve]));

    const valvesDistanceMap = [...workableValves, valvesMap['AA']].reduce((acc, valve) => {
        return {
            ...acc,
            [valve.name]: workableValves.reduce((acc2, workableValve) => {
                return {
                    ...acc2,
                    [workableValve.name]: getDistance(valve.name, workableValve.name, valvesMap),
                }
            }, {})
        }
    }, {});

    const getMaxPressureForValves = valves => {
        const iter = (prev, curr, left, time, pressure) => {
            if (time <= 0) {
                return pressure;
            }


            const distance = valvesDistanceMap[prev][curr];
            const newTime = time - distance - 1;
            const newPressure = pressure + (newTime * valvesMap[curr].rate);
            const newLeft = left.filter(valve => valve !== curr);

            if (newLeft.length === 0) {
                return pressure;
            }

            return Math.max(
                ...newLeft.map(valve => iter(curr, valve, newLeft, newTime, newPressure))
            );
        };

        return Math.max(
            ...valves.map(
                valve => iter('AA', valve.name, valves.map(({name}) => name), 26, 0)
            )
        );
    }

    const workableValvesCount = workableValves.length;
    const casesCount = parseInt(new Array(workableValvesCount).fill(1).join(''), 2);

    let maxPress = 0;

    for (let i = 0; i <= casesCount; i++) {
        const arr = Number(i).toString(2).split('').reverse();

        const myValves = [];
        const elephantsValves = [];

        for (let k = 0; k < workableValvesCount; k++) {
            if (+arr[k] === 0 || arr[k] === undefined) {
                myValves.push(workableValves[k]);
            } else {
                elephantsValves.push(workableValves[k]);
            }
        }

        const pressure = getMaxPressureForValves(myValves) + getMaxPressureForValves(elephantsValves);

        maxPress = Math.max(maxPress, pressure);
    }

    return maxPress;
}

const data = fs.readFileSync(path.join(__dirname,'./input.txt'), 'utf8');

const maxPressure = getMaxPressure(data);

console.log(maxPressure);
