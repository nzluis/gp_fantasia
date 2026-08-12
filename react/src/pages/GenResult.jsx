import { useEffect, useState } from 'react';
import PodiumForm from '../components/PodiumForm/PodiumForm';
import Spinner from '../components/Spinner/Spinner';
import { useMinLoadingTime } from '../hooks/useMinLoadingTime';
import styles from './GenResult.module.css';
import getHost from '../utils/getHost';

export default function GenResult() {
    const [moto3Riders, setMoto3Riders] = useState([]);
    const [moto2Riders, setMoto2Riders] = useState([]);
    const [motoGPRiders, setMotoGPRiders] = useState([]);
    const [circuits, setCircuits] = useState([]);
    const [loading, setLoading] = useState(true);
    const showSpinner = useMinLoadingTime(loading);
    const [noPendingResult, setNoPendingResult] = useState(false);
    const [podiums, setPodiums] = useState({
        circuit: '',
        moto3: { first: '', second: '', third: '' },
        moto2: { first: '', second: '', third: '' },
        motoGP: { first: '', second: '', third: '' },
    });

    // Función para manejar los cambios en los podiums
    const handlePodiumChange = (category, updatedPodium) => {
        setPodiums((prevPodiums) => ({
            ...prevPodiums,
            [category]: updatedPodium,
        }));
    };

    useEffect(() => {
        const fetchRiders = async () => {
            try {
                const response = await fetch(getHost() + '/riders');
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
        const fetchCircuits = async () => {
            try {
                const response = await fetch(getHost() + '/circuits');
                if (!response.ok)
                    return alert('Algo fue mal consiguiendo los circuitos');
                const resultsResponse = await fetch(getHost() + '/results');
                if (!resultsResponse.ok) {
                    return alert('Algo fue mal consiguiendo los resultados');
                }
                const circuits = await response.json();
                const results = await resultsResponse.json();
                const recentFinishedCircuit = circuits.filter((circuit) => {
                    const raceDate = new Date(circuit.date);
                    const today = new Date();
                    return (
                        today.getTime() >= raceDate.getTime() &&
                        today.getTime() <= raceDate.getTime() + 3 * 864e5
                    );
                });
                if (recentFinishedCircuit.length === 0) {
                    setNoPendingResult(true);
                    return;
                }
                const resultExistsForCurrentCircuit = results.some(
                    (result) =>
                        result.circuit === recentFinishedCircuit[0].circuitID
                );
                if (resultExistsForCurrentCircuit) {
                    setNoPendingResult(true);
                    return;
                }
                setCircuits(recentFinishedCircuit);
            } catch (error) {
                console.error(error);
                alert('Error al obtener los circuitos');
            } finally {
                setLoading(false);
            }
        };
        if (motoGPRiders.length === 0 || !motoGPRiders) fetchCircuits();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(getHost() + '/results/create', {
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
                alert('Algo sucedió guardando su resultado');
            }
            const saveBet = await response.json();
            console.log(saveBet);
            setPodiums({
                circuit: '',
                moto3: { first: '', second: '', third: '' },
                moto2: { first: '', second: '', third: '' },
                motoGP: { first: '', second: '', third: '' },
            });
            alert('Resultado guardado con éxito');
        } catch (error) {
            console.error(error);
            alert('Error guardando su resultado');
        }
    };

    if (showSpinner) return <Spinner />;

    if (noPendingResult) {
        return (
            <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>
                    No hay resultados por actualizar
                </p>
                <p className={styles.emptyText}>
                    El resultado del último circuito ya está registrado.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Registrar Resultado</h1>
            <form onSubmit={handleSubmit}>
                <h3>Resultado</h3>
                <div>
                    <label>Circuito: </label>
                    <select
                        value={podiums.user}
                        onChange={(e) =>
                            handlePodiumChange('circuit', e.target.value)
                        }
                        required
                    >
                        <option value=''>Seleccionar</option>
                        {circuits.map((circuit) => (
                            <option key={circuit._id} value={circuit.circuitID}>
                                {circuit.name}
                            </option>
                        ))}
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
                    <button type='submit'>Guardar Resultados</button>
                </div>
            </form>
        </div>
    );
}
