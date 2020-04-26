export function checkBoard(dice, combos) {
    //convert to sorted string for easier regex tests
    dice.sort();
    let rolled = dice.join("");
    let farkle = true;
    let points = 0;
    let possible = [];

    //test all of the combos for best possible score
    combos = combos || COMMERCIAL_COMBOS;
    for (let i = 0; i < combos.length && rolled.length > 0; i++) {
        const combo = combos[i];
        const matches = rolled.match(combo.regex);
        if (matches) {
            console.log("matched", combo.name, matches.length);
            points += (combo.points * matches.length);
            rolled = rolled.replace(combo.regex, "");
            farkle = false;

            //only those matches should be selectable
            matches.forEach(pattern => {
                pattern.split("").forEach(num => {
                    possible.push(parseInt(num));
                });
            });
        }
    }

    console.log("checkBoard", rolled, { points, farkle, possible });
    return { points, farkle, possible };
}

export function testCombos() {
    COMMERCIAL_COMBOS.forEach(test => {
        let results = checkBoard(test.example, COMMERCIAL_COMBOS);
        if (results.points !== test.points) {
            console.error("Commercial Failed", test.name);
        } else {
            console.log("Commercial Passed", test.name);
        }
    });

    CLASSIC_COMBOS.forEach(test => {
        let results = checkBoard(test.example, CLASSIC_COMBOS);
        if (results.points !== test.points) {
            console.error("Classic Failed", test.name);
        } else {
            console.log("Classic Passed", test.name);
        }
    });
}

const CLASSIC_COMBOS = [
    { name: "Three 1s", regex: /[1]{3}/g, points: 1000, example: [1, 1, 1, 2, 3, 4] },
    { name: "Three 6s", regex: /[6]{3}/g, points: 600, example: [6, 6, 6, 2, 3, 4] },
    { name: "Three 5s", regex: /[5]{3}/g, points: 500, example: [5, 5, 5, 2, 3, 4] },
    { name: "Three 4s", regex: /[4]{3}/g, points: 400, example: [4, 4, 4, 2, 3, 6] },
    { name: "Three 3s", regex: /[3]{3}/g, points: 300, example: [3, 3, 3, 2, 4, 6] },
    { name: "Three 2s", regex: /[2]{3}/g, points: 200, example: [2, 2, 2, 3, 4, 6] },
    { name: "One 1", regex: /[1]/g, points: 100, example: [1, 2, 3, 4, 6, 2] },
    { name: "One 5", regex: /[5]/g, points: 50, example: [5, 2, 3, 4, 6, 2] }
];

const COMMERCIAL_COMBOS = [
    { name: "Six of a Kind", regex: /(.)\1{5}/g, points: 3000, example: [6, 6, 6, 6, 6, 6] },
    { name: "Two Triplets", regex: /(.)\1{2}(.)\2{2}/g, points: 2500, example: [2, 2, 2, 3, 3, 3] },
    { name: "Five of a Kind", regex: /(.)\1{4}/g, points: 2000, example: [5, 5, 5, 5, 5, 2] },
    { name: "Four of a Kind + Pair", regex: /(.)\1{3}(.)\2{1}/g, points: 1500, example: [4, 4, 2, 2, 2, 2] },   //not perfect regex
    { name: "Three Pairs", regex: /(.)\1{1}(.)\2{1}(.)\3{1}/g, points: 1500, example: [3, 3, 2, 2, 4, 4] },
    { name: "Straight", regex: /123456/g, points: 1500, example: [1, 2, 3, 4, 5, 6] },
    { name: "Four of a Kind", regex: /(.)\1{3}/g, points: 1000, example: [4, 4, 4, 4, 2, 3] },
    { name: "Three 6s", regex: /[6]{3}/g, points: 600, example: [6, 6, 6, 2, 3, 4] },
    { name: "Three 5s", regex: /[5]{3}/g, points: 500, example: [5, 5, 5, 2, 3, 4] },
    { name: "Three 4s", regex: /[4]{3}/g, points: 400, example: [4, 4, 4, 2, 3, 6] },
    { name: "Three 3s", regex: /[3]{3}/g, points: 300, example: [3, 3, 3, 2, 4, 6] },
    { name: "Three 1s", regex: /[1]{3}/g, points: 300, example: [1, 1, 1, 2, 3, 4] },
    { name: "Three 2s", regex: /[2]{3}/g, points: 200, example: [2, 2, 2, 3, 4, 6] },
    { name: "One 1", regex: /[1]/g, points: 100, example: [1, 2, 3, 4, 6, 2] },
    { name: "One 5", regex: /[5]/g, points: 50, example: [5, 2, 3, 4, 6, 2] }
];