export function checkBoard(dice, comboType) {
    //convert to sorted string for easier regex tests
    dice.sort();
    let rolled = dice.join("");
    let farkle = true;
    let points = 0;
    let possible = [];

    //test all of the combos for best possible score
    const combos = getCombos(comboType);
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

    console.log("checkBoard", comboType, rolled, { points, farkle, possible });
    return { points, farkle, possible };
}

export function getCombos(name) {
    return name === "commercial" ? COMMERCIAL_COMBOS : CLASSIC_COMBOS;
}

const CLASSIC_COMBOS = [
    { name: "Three 1s", regex: /[1]{3}/g, points: 1000, key: "A1", example: [1, 1, 1, 2, 3, 4] },
    { name: "Three 6s", regex: /[6]{3}/g, points: 600, key: "A2", example: [6, 6, 6, 2, 3, 4] },
    { name: "Three 5s", regex: /[5]{3}/g, points: 500, key: "A3", example: [5, 5, 5, 2, 3, 4] },
    { name: "Three 4s", regex: /[4]{3}/g, points: 400, key: "A4", example: [4, 4, 4, 2, 3, 6] },
    { name: "Three 3s", regex: /[3]{3}/g, points: 300, key: "A5", example: [3, 3, 3, 2, 4, 6] },
    { name: "Three 2s", regex: /[2]{3}/g, points: 200, key: "A6", example: [2, 2, 2, 3, 4, 6] },
    { name: "One 1", regex: /[1]/g, points: 100, key: "A7", example: [1, 2, 3, 4, 6, 2] },
    { name: "One 5", regex: /[5]/g, points: 50, key: "A8", example: [5, 2, 3, 4, 6, 2] }
];

const COMMERCIAL_COMBOS = [
    { name: "Six of a Kind", regex: /(.)\1{5}/g, points: 3000, key: "B1", example: [6, 6, 6, 6, 6, 6] },
    { name: "Two Triplets", regex: /(.)\1{2}(.)\2{2}/g, points: 2500, key: "B2", example: [2, 2, 2, 3, 3, 3] },
    { name: "Five of a Kind", regex: /(.)\1{4}/g, points: 2000, key: "B3", example: [5, 5, 5, 5, 5, 2] },
    { name: "Four of a Kind + Pair", regex: /(.)\1{3}(.)\2{1}/g, points: 1500, key: "B4", example: [4, 4, 2, 2, 2, 2] },   //not perfect regex
    { name: "Three Pairs", regex: /(.)\1{1}(.)\2{1}(.)\3{1}/g, points: 1500, key: "B5", example: [3, 3, 2, 2, 4, 4] },
    { name: "Straight", regex: /123456/g, points: 1500, key: "B6", example: [1, 2, 3, 4, 5, 6] },
    { name: "Four of a Kind", regex: /(.)\1{3}/g, points: 1000, key: "B7", example: [4, 4, 4, 4, 2, 3] },
    { name: "Three 6s", regex: /[6]{3}/g, points: 600, key: "B8", example: [6, 6, 6, 2, 3, 4] },
    { name: "Three 5s", regex: /[5]{3}/g, points: 500, key: "B9", example: [5, 5, 5, 2, 3, 4] },
    { name: "Three 4s", regex: /[4]{3}/g, points: 400, key: "B10", example: [4, 4, 4, 2, 3, 6] },
    { name: "Three 3s", regex: /[3]{3}/g, points: 300, key: "B11", example: [3, 3, 3, 2, 4, 6] },
    { name: "Three 1s", regex: /[1]{3}/g, points: 300, key: "B12", example: [1, 1, 1, 2, 3, 4] },
    { name: "Three 2s", regex: /[2]{3}/g, points: 200, key: "B13", example: [2, 2, 2, 3, 4, 6] },
    { name: "One 1", regex: /[1]/g, points: 100, key: "B14", example: [1, 2, 3, 4, 6, 2] },
    { name: "One 5", regex: /[5]/g, points: 50, key: "B15", example: [5, 2, 3, 4, 6, 2] }
];

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