import { useState, useEffect } from 'react';
import styles from './Results.module.css';
import { convertPos } from '../utils/constants';
import { calculatePoints } from '../utils/calculatePoints';
import { toUpperise } from '../utils/toUpperise';
import { formatName } from '../utils/formatName';
import getHost from '../utils/getHost';
import Spinner from '../components/Spinner/Spinner';
import { useMinLoadingTime } from '../hooks/useMinLoadingTime';

export default function Results() {
    const [results, setResults] = useState([]);
    const [bets, setBets] = useState([]);
    const [openCircuit, setOpenCircuit] = useState(null);
    const [loading, setLoading] = useState(true);
    const showSpinner = useMinLoadingTime(loading);

    useEffect(() => {
        async function fetchData() {
            try {
                const resultsResponse = await fetch(getHost() + '/results');
                const resultsData = await resultsResponse.json();
                const betsResponse = await fetch(getHost() + '/bets');
                const betsData = await betsResponse.json();

                setResults(resultsData);
                setBets(betsData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (showSpinner) return <Spinner />;

    const toggleCircuit = (circuit) => {
        setOpenCircuit((prev) => (prev === circuit ? null : circuit));
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Resultados</h1>
            {results
                .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort results by date
                .map((result) => (
                    <div key={result._id} className={styles.circuitSection}>
                        {/* Circuit Header */}
                        <h2
                            onClick={() => toggleCircuit(result.circuit)}
                            className={styles.circuitHeader}
                        >
                            {result.circuit.replace(/_/g, ' ').toUpperCase()} (
                            {new Date(result.date).toLocaleDateString()})
                        </h2>

                        {openCircuit === result.circuit && (
                            <div className={styles.circuitContent}>
                                {/* Results Table */}
                                <table className={styles.resultsTable}>
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Pos</th>
                                            <th>Rider</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(result).map(
                                            ([competition, podium]) => {
                                                if (
                                                    ![
                                                        'moto3',
                                                        'moto2',
                                                        'motoGP',
                                                    ].includes(competition)
                                                )
                                                    return null;

                                                return Object.entries(
                                                    podium
                                                ).map(
                                                    (
                                                        [position, rider],
                                                        index
                                                    ) => (
                                                        <tr
                                                            key={`${competition}-${position}`}
                                                        >
                                                            {index === 0 && (
                                                                <td
                                                                    rowSpan={3}
                                                                    style={{
                                                                        textTransform:
                                                                            'uppercase',
                                                                    }}
                                                                >
                                                                    {
                                                                        competition
                                                                    }
                                                                </td>
                                                            )}
                                                            <td>
                                                                {
                                                                    convertPos[
                                                                        position
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {formatName(
                                                                    rider
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>

                                {/* User Bets and Points */}
                                {bets
                                    .filter(
                                        (bet) => bet.circuit === result.circuit
                                    )
                                    .map((bet) => {
                                        let totalPoints = 0;

                                        return (
                                            <div
                                                key={bet._id}
                                                className={styles.userSection}
                                            >
                                                <h3>
                                                    {toUpperise(bet.user)}
                                                    &apos;s Points
                                                </h3>
                                                {Object.entries(result).map(
                                                    ([competition, podium]) => {
                                                        if (
                                                            ![
                                                                'moto3',
                                                                'moto2',
                                                                'motoGP',
                                                            ].includes(
                                                                competition
                                                            )
                                                        )
                                                            return null;

                                                        const points =
                                                            calculatePoints(
                                                                podium,
                                                                bet[competition]
                                                            );
                                                        totalPoints += points;

                                                        return (
                                                            <div
                                                                key={`${bet._id}-${competition}`}
                                                                className={
                                                                    styles.competitionSection
                                                                }
                                                            >
                                                                <h4>
                                                                    {competition.toUpperCase()}
                                                                </h4>
                                                                <table
                                                                    className={
                                                                        styles.userTable
                                                                    }
                                                                >
                                                                    <thead>
                                                                        <tr>
                                                                            <th>
                                                                                Pos
                                                                            </th>
                                                                            <th>
                                                                                Rider
                                                                            </th>
                                                                            <th>
                                                                                Points
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {Object.entries(
                                                                            bet[
                                                                                competition
                                                                            ]
                                                                        ).map(
                                                                            (
                                                                                [
                                                                                    position,
                                                                                    rider,
                                                                                ],
                                                                                index
                                                                            ) => {
                                                                                const positionPoints =
                                                                                    rider ===
                                                                                    podium[
                                                                                        position
                                                                                    ]
                                                                                        ? [
                                                                                              6,
                                                                                              5,
                                                                                              4,
                                                                                          ][
                                                                                              index
                                                                                          ]
                                                                                        : Object.values(
                                                                                              podium
                                                                                          ).includes(
                                                                                              rider
                                                                                          )
                                                                                        ? 2
                                                                                        : 0;
                                                                                return (
                                                                                <tr
                                                                                    key={`${bet._id}-${competition}-${position}`}
                                                                                >
                                                                                    <td>
                                                                                        {
                                                                                            convertPos[
                                                                                                position
                                                                                            ]
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        {formatName(
                                                                                            rider
                                                                                        )}
                                                                                    </td>
                                                                                    <td
                                                                                        className={
                                                                                            positionPoints >
                                                                                            0
                                                                                                ? styles.pointsHit
                                                                                                : undefined
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            positionPoints
                                                                                        }
                                                                                    </td>
                                                                                </tr>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <td
                                                                                colSpan={
                                                                                    2
                                                                                }
                                                                            >
                                                                                Total
                                                                                Points
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    points
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                                <div
                                                    className={
                                                        styles.totalPoints
                                                    }
                                                >
                                                    <strong>
                                                        Total Points for{' '}
                                                        {toUpperise(bet.user)}:{' '}
                                                        {totalPoints}
                                                    </strong>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
}
