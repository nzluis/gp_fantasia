export const calculatePoints = (podium, userBet) => {
    let points = 0;
    ['first', 'second', 'third'].forEach((position, index) => {
        const betRider = userBet[position];
        const actualRider = podium[position];
        if (betRider === actualRider) {
            points += [6, 4, 2][index];
        } else if (Object.values(podium).includes(betRider)) {
            points += 1;
        }
    });
    return points === 12 ? 20 : points;
};
