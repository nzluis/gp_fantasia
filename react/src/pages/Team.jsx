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
    const [bets, setBets] = useState([]);
    const [podiums, setPodiums] = useState({
        user: '',
        circuit: '',
        forceSend: false,
        moto3: { first: '', second: '', third: '' },
        moto2: { first: '', second: '', third: '' },
        motoGP: { first: '', second: '', third: '' },
    });

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
        console.log('Resultados de los Podiums:');
        console.log('User:', podiums.user);
        console.log('Circuit: ', podiums.circuit);
        console.log('Moto3:', podiums.moto3);
        console.log('Moto2:', podiums.moto2);
        console.log('MotoGP:', podiums.motoGP);

        try {
            const response = await fetch(
                'https://fantasygpback.onrender.com/bets/create',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(podiums),
                }
            );
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
                    return alert('Algo fue mal consiguiendo los pilotos');
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
                alert('Error al obtener los pilotos');
            }
        };
        if (motoGPRiders.length === 0 || !motoGPRiders) fetchRiders();
    }, []);

    useEffect(() => {
        const fetchRiders = async () => {
            try {
                const response = await fetch(
                    'https://fantasygpback.onrender.com/nextCircuit'
                );
                if (!response.ok)
                    return alert('Algo fue mal consiguiendo los circuitos');
                const circuit = await response.json();
                setNextCircuit(circuit);
                setPodiums((prevPodium) => ({
                    ...prevPodium,
                    circuit: circuit.circuitID,
                }));
            } catch (error) {
                console.error(error);
                alert('Error al obtener los circuitos');
            }
        };
        if (motoGPRiders.length === 0 || !motoGPRiders) fetchRiders();
    }, []);

    useEffect(() => {
        const fetchBets = async () => {
            try {
                const betsResponse = await fetch('http://localhost:5000/bets');
                if (!betsResponse.ok)
                    return alert('Algo fue mal consiguiendo las apuestas');
                const betsData = await betsResponse.json();
                setBets(betsData);
            } catch (error) {
                console.error(error);
                alert('Error al obtener las apuestas');
            }
        };
        if (bets.length === 0 || !bets) fetchBets();
    }, []);

    return (
        <div className={styles.container}>
            {/* <h1>Tu apuesta</h1> */}
            <form onSubmit={handleSubmit}>
                <h3>{nextCircuit.name}</h3>
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
                        {Object.keys(users).map((userKey) => {
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
            {nextCircuitBets.length > 0 &&
                new Date() > new Date(nextCircuit.due_date) && (
                    <div>
                        <h3>Apuestas para {nextCircuit.name}</h3>
                        <table className={styles.standingsTable}>
                            <thead>
                                <tr>
                                    <th>User</th>
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
                                            {moto3Riders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.moto3.first
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                            <br />
                                            {moto3Riders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.moto3.second
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                            <br />
                                            {moto3Riders
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
                                            {moto2Riders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.moto2.first
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                            <br />
                                            {moto2Riders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.moto2.second
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                            <br />
                                            {moto2Riders
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
                                            {motoGPRiders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.motoGP.first
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                            <br />
                                            {motoGPRiders
                                                .find(
                                                    (rider) =>
                                                        rider.riderID ===
                                                        bet.motoGP.second
                                                )
                                                .fullName.split(' ')
                                                .slice(0, 2)
                                                .join(' ')}
                                            <br />
                                            {motoGPRiders
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
        </div>
    );
}
