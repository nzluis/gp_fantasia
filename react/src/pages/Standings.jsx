import { useState, useEffect } from 'react';
import styles from './Standings.module.css';
import { calculatePoints } from '../utils/calculatePoints';

export default function Standings() {
    const [results, setResults] = useState([]);
    const [bets, setBets] = useState([]);
    const [openCircuit, setOpenCircuit] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const resultsResponse = await fetch(
                'https://fantasygpback.onrender.com/results'
            );
            const resultsData = await resultsResponse.json();
            const betsResponse = await fetch(
                'https://fantasygpback.onrender.com/bets'
            );
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
                const user = bet.user;

                // Initialize user in standings
                if (!standings[user]) {
                    standings[user] = { total: 0, progress: [] };
                }

                let totalPointsForCircuit = 0;

                // Calculate points for each competition in the circuit
                ['moto3', 'moto2', 'motoGP'].forEach((competition) => {
                    const podium = result[competition];
                    const userBet = bet[competition];
                    totalPointsForCircuit += calculatePoints(podium, userBet);
                });

                // Update user standings
                standings[user].total += totalPointsForCircuit;
                standings[user].progress.push({
                    circuit: result.circuit,
                    points: standings[user].total,
                });
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
                                            const progress = data.progress.find(
                                                (p) =>
                                                    p.circuit === result.circuit
                                            );
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
                                                    <td>
                                                        {progress
                                                            ? progress.points
                                                            : 0}
                                                    </td>
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
