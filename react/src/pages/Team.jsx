import { useMemo, useState } from 'react';
import PodiumForm from '../components/PodiumForm/PodiumForm';
import styles from './Team.module.css';
import { useEffect } from 'react';
import { users } from '../utils/constants';

export default function Team() {
    const [moto3Riders, setMoto3Riders] = useState([]);
    const [moto2Riders, setMoto2Riders] = useState([]);
    const [motoGPRiders, setMotoGPRiders] = useState([]);
    const [nextCircuit, setNextCircuit] = useState({});
    const [lastCircuit, setLastCircuit] = useState({});
    const [bets, setBets] = useState([]);
    const [podiums, setPodiums] = useState({
        user: '',
        circuit: '',
        forceSend: false,
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

    // Función para manejar los cambios en los podiums
    const handlePodiumChange = (category, updatedPodium) => {
        setPodiums((prevPodiums) => ({
            ...prevPodiums,
            [category]: updatedPodium,
        }));
    };

    // const handleCheckboxChange = (e) => {
    //     const { checked } = e.target;
    //     setPodiums((prevPodiums) => ({
    //         ...prevPodiums,
    //         forceSend: checked, // Actualiza el valor de forceSend
    //     }));
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                'https://fantasygpback.onrender.com/bets/create',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(podiums),
            });
            if (!response.ok) {
                const error = await response.json();
                if (error.error) {
                    alert(error.message);
                    return;
                }
                alert('Algo sucedió guardando su apuesta');
            }
            const saveBet = await response.json();
            console.log(saveBet);
            setPodiums({
                user: '',
                circuit: '',
                forceSend: false,
                moto3: { first: '', second: '', third: '' },
                moto2: { first: '', second: '', third: '' },
                motoGP: { first: '', second: '', third: '' },
            });
            alert('Apuesta guardada correctamente');
        } catch (error) {
            console.error(error);
            alert('Error guardando su apuesta');
        }
    };

    useEffect(() => {
        const fetchRiders = async () => {
            try {
                const response = await fetch(
                    'https://fantasygpback.onrender.com/riders'
                );
                if (!response.ok)
                    console.error(
                        'Algo fue mal consiguiendo los pilotos',
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
            }
        };
        if (motoGPRiders.length === 0 || !motoGPRiders) fetchRiders();
    }, []);

    useEffect(() => {
        const fetchNextCircuit = async () => {
            try {
                const response = await fetch(
                    'https://fantasygpback.onrender.com/nextCircuit'
                );
                if (!response.ok)
                    return console.error(
                        'Algo fue mal consiguiendo los circuitos',
                        response
                    );
                const circuit = await response.json();
                setNextCircuit(circuit);
                setPodiums((prevPodium) => ({
                    ...prevPodium,
                    circuit: circuit.circuitID,
                }));
            } catch (error) {
                console.error(error);
            }
        };
        if (motoGPRiders.length === 0 || !motoGPRiders) fetchNextCircuit();
    }, []);

    useEffect(() => {
        const fetchLastCircuit = async () => {
            try {
                const response = await fetch(
                    'https://fantasygpback.onrender.com/lastCircuit'
                );
                if (!response.ok)
                    return console.error(
                        'Algo fue mal consiguiendo el último circuito',
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
                const betsResponse = await fetch(
                    'https://fantasygpback.onrender.com/bets'
                );
                if (!betsResponse.ok)
                    return console.error(
                        'Algo fue mal consiguiendo las apuestas',
                        betsResponse
                    );
                const betsData = await betsResponse.json();
                setBets(betsData);
            } catch (error) {
                console.error(error);
            }
        };
        if (bets.length === 0 || !bets) fetchBets();
    }, []);

    return (
        <div className={styles.container}>
            {/* <h1>Tu apuesta</h1> */}
            {!nextCircuit.name &&
                lastCircuitBets.length > 0 &&
                new Date() > new Date(lastCircuit.due_date) && (
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
                                            {moto3Riders.length > 0 &&
                                                '1º ' +
                                                moto3Riders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.moto3.first
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                            <br />
                                            {moto3Riders.length > 0 &&
                                                '2º ' +
                                                moto3Riders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.moto3.second
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                            <br />
                                            {moto3Riders.length > 0 &&
                                                '3º ' +
                                                moto3Riders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.moto3.third
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                        </td>
                                        <td>
                                            {moto2Riders.length > 0 &&
                                                '1º ' +
                                                moto2Riders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.moto2.first
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                            <br />
                                            {moto2Riders.length > 0 &&
'2º ' +
                                                moto2Riders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.moto2.second
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                            <br />
                                            {moto2Riders.length > 0 &&
'3º ' +
                                                moto2Riders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.moto2.third
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                        </td>
                                        <td>
                                            {motoGPRiders.length > 0 &&
'1º ' +
                                                motoGPRiders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.motoGP.first
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                            <br />
                                            {motoGPRiders.length > 0 &&
'2º ' +
                                                motoGPRiders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.motoGP
.second
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                            <br />
                                            {motoGPRiders.length > 0 &&
'3º ' +
                                                motoGPRiders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.motoGP.third
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            <form onSubmit={handleSubmit}>
                <h3>{nextCircuit.name ?? nextCircuit.message}</h3>
                <div>
                    <label>User: </label>
                    <select
                        value={podiums.user}
                        onChange={(e) =>
                            handlePodiumChange('user', e.target.value)
                        }
                        required
                    >
                        <option value=''>Seleccionar</option>
                        {nextCircuit.name &&
                            Object.keys(users).map((userKey) => {
                                if (
                                    !nextCircuitBets ||
                                    nextCircuitBets.length === 0
                                )
                                    return;
                                const userBetExists = nextCircuitBets.find(
                                    (bet) => bet.user === userKey
                                );
                                if (!userBetExists) {
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
                />
                <PodiumForm
                    riders={moto2Riders}
                    category='moto2'
                    onPodiumChange={handlePodiumChange}
                />
                <PodiumForm
                    riders={motoGPRiders}
                    category='motoGP'
                    onPodiumChange={handlePodiumChange}
                />
                <div className={styles.submitArea}>
                    <button type='submit'>Enviar Resultados</button>
                    {/* <div className={styles.checkbox}>
                        <label
                            className={styles.checkboxLabel}
                            htmlFor='forceSend'
                        >
                            Force
                        </label>
                        <input
                            type='checkbox'
                            id='forceSend'
                            checked={podiums.forceSend}
                            onChange={handleCheckboxChange}
                        />
                    </div> */}
                </div>
            </form>
        </div>
    );
}
