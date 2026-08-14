import { useMemo, useState, useEffect, useCallback } from 'react';
import PodiumForm from '../components/PodiumForm/PodiumForm';
import Spinner from '../components/Spinner/Spinner';
import { useMinLoadingTime } from '../hooks/useMinLoadingTime';
import toast from 'react-hot-toast';
import styles from './Team.module.css';
import { users } from '../utils/constants';
import getHost from '../utils/getHost';

const STORAGE_KEYS = {
    user: btoa('user'),
};

const getBetKey = (circuitID, user) => btoa(`bet_${circuitID}_${user}`);

const getStoredUser = () => localStorage.getItem(STORAGE_KEYS.user);
const setStoredUser = (user) => localStorage.setItem(STORAGE_KEYS.user, user);

const getStoredBet = (circuitID, user) => {
    const key = getBetKey(circuitID, user);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
};

const setStoredBet = (circuitID, user, bet) => {
    const key = getBetKey(circuitID, user);
    localStorage.setItem(key, JSON.stringify(bet));
};

const formatPodiumRider = (riders, riderID, position) => {
    if (!riders.length || !riderID) return null;
    const rider = riders.find((r) => r.riderID === riderID);
    if (!rider) return null;
    const shortName = rider.fullName.split(' ').slice(0, 2).join(' ');
    return `${position}º ${shortName}`;
};

export default function Team() {
    const [moto3Riders, setMoto3Riders] = useState([]);
    const [moto2Riders, setMoto2Riders] = useState([]);
    const [motoGPRiders, setMotoGPRiders] = useState([]);
    const [nextCircuit, setNextCircuit] = useState({});
    const [lastCircuit, setLastCircuit] = useState({});
    const [bets, setBets] = useState([]);
    const [ridersReady, setRidersReady] = useState(false);
    const [circuitReady, setCircuitReady] = useState(false);
    const [betsReady, setBetsReady] = useState(false);
    const [podiums, setPodiums] = useState({
        user: '',
        circuit: '',
        moto3: { first: '', second: '', third: '' },
        moto2: { first: '', second: '', third: '' },
        motoGP: { first: '', second: '', third: '' },
    });

    const lastCircuitBets = useMemo(() => {
        return bets.filter((bet) => bet.circuit === lastCircuit.circuitID);
    }, [bets, lastCircuit]);

    const nextCircuitBets = useMemo(() => {
        return bets.filter((bet) => bet.circuit === nextCircuit.circuitID);
    }, [bets, nextCircuit]);

    const userHasBetInLocalStorage = useCallback(() => {
        if (!podiums.user || !nextCircuit.circuitID) return false;
        const stored = getStoredBet(nextCircuit.circuitID, podiums.user);
        return stored !== null;
    }, [podiums.user, nextCircuit.circuitID]);

    const handlePodiumChange = (category, updatedPodium) => {
        setPodiums((prevPodiums) => ({
            ...prevPodiums,
            [category]: updatedPodium,
        }));
    };

    const handleUserChange = (newUser) => {
        setStoredUser(newUser);
        setPodiums((prevPodiums) => ({
            ...prevPodiums,
            user: newUser,
        }));

        if (nextCircuit.circuitID) {
            const storedBet = getStoredBet(nextCircuit.circuitID, newUser);
            if (storedBet) {
                setPodiums((prev) => ({
                    ...prev,
                    user: newUser,
                    moto3: storedBet.moto3 || { first: '', second: '', third: '' },
                    moto2: storedBet.moto2 || { first: '', second: '', third: '' },
                    motoGP: storedBet.motoGP || { first: '', second: '', third: '' },
                }));
            } else {
                setPodiums((prev) => ({
                    ...prev,
                    user: newUser,
                    moto3: { first: '', second: '', third: '' },
                    moto2: { first: '', second: '', third: '' },
                    motoGP: { first: '', second: '', third: '' },
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(getHost() + '/bets/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(podiums),
            });
            if (!response.ok) {
                const error = await response.json();
                if (error.error) {
                    toast.error(error.message);
                    return;
                }
                toast.error('Algo sucedió guardando su apuesta');
                return;
            }
            const saveBet = await response.json();
            console.log(saveBet);

            setStoredBet(nextCircuit.circuitID, podiums.user, {
                moto3: podiums.moto3,
                moto2: podiums.moto2,
                motoGP: podiums.motoGP,
            });

            setPodiums({
                user: podiums.user,
                circuit: nextCircuit.circuitID,
                moto3: { first: '', second: '', third: '' },
                moto2: { first: '', second: '', third: '' },
                motoGP: { first: '', second: '', third: '' },
            });
            toast.success('Apuesta guardada correctamente');
        } catch (error) {
            console.error(error);
            toast.error('Error guardando su apuesta');
        }
    };

    useEffect(() => {
        const fetchRiders = async () => {
            try {
                const response = await fetch(getHost() + '/riders');
                if (!response.ok)
                    console.error(
                        'Algo fue mal conseguir los pilotos',
                        response
                    );
                const riders = await response.json();
                setMoto3Riders(
                    riders.filter((rider) => rider.category === 'moto3')
                );
                setMoto2Riders(
                    riders.filter((rider) => rider.category === 'moto2')
                );
                const motoGP = riders.filter(
                    (rider) => rider.category === 'motoGP'
                );
                setMotoGPRiders(motoGP);
            } catch (error) {
                console.error(error);
            } finally {
                setRidersReady(true);
            }
        };
        fetchRiders();
    }, []);

    useEffect(() => {
        const fetchNextCircuit = async () => {
            try {
                const response = await fetch(getHost() + '/nextCircuit');
                if (!response.ok)
                    return console.error(
                        'Algo fue mal conseguir los circuitos',
                        response
                    );
                const circuit = await response.json();
                setNextCircuit(circuit);
            } catch (error) {
                console.error(error);
            } finally {
                setCircuitReady(true);
            }
        };
        fetchNextCircuit();
    }, []);

    useEffect(() => {
        if (nextCircuit.circuitID) {
            setPodiums((prev) => ({
                ...prev,
                circuit: nextCircuit.circuitID,
            }));

            const storedUser = getStoredUser();
            if (storedUser && Object.keys(users).includes(storedUser)) {
                handleUserChange(storedUser);
            }
        }
    }, [nextCircuit.circuitID]);

    useEffect(() => {
        const fetchLastCircuit = async () => {
            try {
                const response = await fetch(getHost() + '/lastCircuit');
                if (!response.ok)
                    return console.error(
                        'Algo fue mal conseguir el último circuito',
                        response
                    );
                const circuit = await response.json();
                setLastCircuit(circuit);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLastCircuit();
    }, []);

    useEffect(() => {
        const fetchBets = async () => {
            try {
                const betsResponse = await fetch(getHost() + '/bets');
                if (!betsResponse.ok)
                    return console.error(
                        'Algo fue mal conseguir las apuestas',
                        betsResponse
                    );
                const betsData = await betsResponse.json();
                setBets(betsData);
            } catch (error) {
                console.error(error);
            } finally {
                setBetsReady(true);
            }
        };
        fetchBets();
    }, []);

    const isLoading = !(ridersReady && circuitReady && betsReady);
    const showSpinner = useMinLoadingTime(isLoading);
    if (showSpinner) return <Spinner />;

    const hasNextCircuit = !!nextCircuit.name;
    const hasUserBet = userHasBetInLocalStorage();
    const isPostDeadline = new Date() > new Date(lastCircuit.due_date);

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Mi Equipo</h1>

            {!hasNextCircuit && !isPostDeadline && (
                <div className={styles.betsBoard}>
                    <p style={{ textAlign: 'center' }}>Siguiente circuito no disponible</p>
                </div>
            )}

            {hasNextCircuit && hasUserBet && (
                <div className={styles.betsBoard}>
                    <h3>Tu apuesta para</h3>
                    <h3>{nextCircuit.name}</h3>
                    <table className={styles.standingsTable}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Moto3</th>
                                <th>Moto2</th>
                                <th>MotoGP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nextCircuitBets.map((bet) => (
                                <tr key={bet._id}>
                                    <td>{users[bet.user]}</td>
                                    <td>
                                        {formatPodiumRider(
                                            moto3Riders,
                                            bet.moto3.first,
                                            '1'
                                        )}
                                        <br />
                                        {formatPodiumRider(
                                            moto3Riders,
                                            bet.moto3.second,
                                            '2'
                                        )}
                                        <br />
                                        {formatPodiumRider(
                                            moto3Riders,
                                            bet.moto3.third,
                                            '3'
                                        )}
                                    </td>
                                    <td>
                                        {formatPodiumRider(
                                            moto2Riders,
                                            bet.moto2.first,
                                            '1'
                                        )}
                                        <br />
                                        {formatPodiumRider(
                                            moto2Riders,
                                            bet.moto2.second,
                                            '2'
                                        )}
                                        <br />
                                        {formatPodiumRider(
                                            moto2Riders,
                                            bet.moto2.third,
                                            '3'
                                        )}
                                    </td>
                                    <td>
                                        {formatPodiumRider(
                                            motoGPRiders,
                                            bet.motoGP.first,
                                            '1'
                                        )}
                                        <br />
                                        {formatPodiumRider(
                                            motoGPRiders,
                                            bet.motoGP.second,
                                            '2'
                                        )}
                                        <br />
                                        {formatPodiumRider(
                                            motoGPRiders,
                                            bet.motoGP.third,
                                            '3'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {hasNextCircuit && !hasUserBet && (
                <form onSubmit={handleSubmit}>
                    <h3>{nextCircuit.name}</h3>
                    <div>
                        <label>User: </label>
                        <select
                            value={podiums.user}
                            onChange={(e) => handleUserChange(e.target.value)}
                            required
                        >
                            <option value=''>Seleccionar</option>
                            {Object.keys(users).map((userKey) => {
                                const userBet =
                                    nextCircuitBets?.find(
                                        (bet) => bet.user === userKey
                                    ) || false;
                                if (!userBet) {
                                    return (
                                        <option key={userKey} value={userKey}>
                                            {users[userKey]}
                                        </option>
                                    );
                                }
                                return null;
                            })}
                        </select>
                    </div>
                    <PodiumForm
                        riders={moto3Riders}
                        category='moto3'
                        onPodiumChange={handlePodiumChange}
                        initialPodium={podiums.moto3}
                    />
                    <PodiumForm
                        riders={moto2Riders}
                        category='moto2'
                        onPodiumChange={handlePodiumChange}
                        initialPodium={podiums.moto2}
                    />
                    <PodiumForm
                        riders={motoGPRiders}
                        category='motoGP'
                        onPodiumChange={handlePodiumChange}
                        initialPodium={podiums.motoGP}
                    />
                    <div className={styles.submitArea}>
                        <button type='submit'>Enviar Resultados</button>
                    </div>
                </form>
            )}

            {!hasNextCircuit && lastCircuitBets.length > 0 && isPostDeadline && (
                <div className={styles.betsBoard}>
                    <h3>Apuestas para</h3>
                    <h3>{lastCircuit.name}</h3>
                    <table className={styles.standingsTable}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Moto3</th>
                                <th>Moto2</th>
                                <th>MotoGP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lastCircuitBets.map((bet) => (
                                <tr key={bet._id}>
                                    <td>{users[bet.user]}</td>
                                    <td>
                                        {formatPodiumRider(
                                            moto3Riders,
                                            bet.moto3.first,
                                            '1'
                                        )}
                                        <br />
                                        {formatPodiumRider(
                                            moto3Riders,
                                            bet.moto3.second,
                                            '2'
                                        )}
                                        <br />
                                        {formatPodiumRider(
                                            moto3Riders,
                                            bet.moto3.third,
                                            '3'
                                        )}
                                    </td>
                                    <td>
                                        {formatPodiumRider(
                                            moto2Riders,
                                            bet.moto2.first,
                                            '1'
                                        )}
                                        <br />
                                        {formatPodiumRider(
                                            moto2Riders,
                                            bet.moto2.second,
                                            '2'
                                        )}
                                        <br />
                                        {formatPodiumRider(
                                            moto2Riders,
                                            bet.moto2.third,
                                            '3'
                                        )}
                                    </td>
                                    <td>
                                        {formatPodiumRider(
                                            motoGPRiders,
                                            bet.motoGP.first,
                                            '1'
                                        )}
                                        <br />
                                        {formatPodiumRider(
                                            motoGPRiders,
                                            bet.motoGP.second,
                                            '2'
                                        )}
                                        <br />
                                        {formatPodiumRider(
                                            motoGPRiders,
                                            bet.motoGP.third,
                                            '3'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
