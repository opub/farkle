export function checkBoard(dice) {
    dice.sort();
    let rolled = dice.join("");
    console.log("checkBoard", rolled);

    let farkle = true;
    let points = 0;

    const combos = CLASSIC_COMBOS;
    for (let i = 0; i < combos.length && rolled.length > 0; i++) {
        const combo = combos[i];
        const matches = rolled.match(combo.regex);
        if (matches) {
            console.log("matched", combo.name, matches.length);
            points += (combo.points * matches.length);
            rolled = rolled.replace(combo.regex, "");
            farkle = false;
        }
    }

    return { points, farkle };
}

const CLASSIC_COMBOS = [
    { name: "Three 1s", regex: /[1]{3}/g, points: 1000 },
    { name: "Three 6s", regex: /[6]{3}/g, points: 600 },
    { name: "Three 5s", regex: /[5]{3}/g, points: 500 },
    { name: "Three 4s", regex: /[4]{3}/g, points: 400 },
    { name: "Three 3s", regex: /[3]{3}/g, points: 300 },
    { name: "Three 2s", regex: /[2]{3}/g, points: 200 },
    { name: "One 1", regex: /[1]/g, points: 100 },
    { name: "One 5", regex: /[5]/g, points: 50 }
];