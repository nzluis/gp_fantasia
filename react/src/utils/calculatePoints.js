export const calculatePoints = (podium, userBet) => {
    let points = 0;
    let correctPositions = 0;

    ['first', 'second', 'third'].forEach((position, index) => {
        const betRider = userBet[position];
        const actualRider = podium[position];

        if (betRider === actualRider) {
            points += [6, 5, 4][index];
            correctPositions += 1;
        } else if (Object.values(podium).includes(betRider)) {
            points += 1;
        }
    });

    if (correctPositions === 3) {
        return 20;
    }

    return points;
};
