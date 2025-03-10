import { useState, useEffect } from 'react';
import styles from './Standings.module.css';
import { calculatePoints } from '../utils/calculatePoints';
import getHost from '../utils/getHost';

export default function Standings() {
    const [results, setResults] = useState([]);
    const [bets, setBets] = useState([]);
    const [openCircuit, setOpenCircuit] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const resultsResponse = await fetch(getHost + '/results');
            const resultsData = await resultsResponse.json();
            const betsResponse = await fetch(getHost + '/bets');
            const betsData = await betsResponse.json();

            setResults(resultsData);
            setBets(betsData);
        }
        fetchData();
    }, []);

    // Calculate standings
    const calculateStandings = () => {
        const standings = {};

        results.forEach((result) => {
            bets.forEach((bet) => {
                if (bet.circuit !== result.circuit) return;
                const user = bet.user;

                // Inicializar el usuario en standings si no existe
                if (!standings[user]) {
                    standings[user] = { total: 0, progress: [] };
                }

                // Calcular puntos solo para este circuito
                let totalPointsForCircuit = 0;
                ['moto3', 'moto2', 'motoGP'].forEach((competition) => {
                    const podium = result[competition];
                    const userBet = bet[competition];
                    totalPointsForCircuit += calculatePoints(podium, userBet);
                });

                // Agregar puntos del circuito al progreso (no acumulados)
                standings[user].progress.push({
                    circuit: result.circuit,
                    points: totalPointsForCircuit,
                });

                // Actualizar el total acumulado
                standings[user].total = standings[user].progress.reduce(
                    (sum, p) => sum + p.points,
                    0
                );
            });
        });

        return standings;
    };

    const standings = calculateStandings();
    const sortedUsers = Object.entries(standings).sort(
        (a, b) => b[1].total - a[1].total
    );

    // Toggle circuit visibility
    const toggleCircuit = (circuit) => {
        setOpenCircuit((prev) => (prev === circuit ? null : circuit));
    };

    return (
        <div className={styles.container}>
            {/* General Standings Table */}
            <h3>General</h3>
            <table className={styles.standingsTable}>
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>User</th>
                        <th>Total Points</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.map(([user, data], index) => (
                        <tr key={user}>
                            <td>{index + 1}</td>
                            <td>
                                {user.charAt(0).toUpperCase() + user.slice(1)}
                            </td>
                            <td>{data.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Progressive Standings by Circuit */}
            <h3>By Circuit</h3>
            {results
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((result, index) => (
                    <div key={result._id} className={styles.circuitSection}>
                        <h3
                            onClick={() => toggleCircuit(result.circuit)}
                            className={styles.circuitHeader}
                        >
                            {`Circuit ${index + 1}: ${result.circuit
                                .replace(/_/g, ' ')
                                .toUpperCase()}`}
                        </h3>
                        {openCircuit === result.circuit && (
                            <table className={styles.standingsTable}>
                                <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>User</th>
                                        <th>Points After Circuit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedUsers.map(
                                        ([user, data], userIndex) => {
                                            let initIndex = 0;
                                            let progress = 0;
                                            while (initIndex <= index) {
                                                progress +=
                                                    data.progress[initIndex]
                                                        .points;
                                                initIndex += 1;
                                            }
                                            return (
                                                <tr
                                                    key={`${user}-${result.circuit}`}
                                                >
                                                    <td>{userIndex + 1}</td>
                                                    <td>
                                                        {user
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            user.slice(1)}
                                                    </td>
                                                    <td>{progress}</td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                ))}
        </div>
    );
}
