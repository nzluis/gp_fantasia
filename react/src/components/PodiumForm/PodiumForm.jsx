import { useState } from 'react';

export default function PodiumForm({ riders, category, onPodiumChange }) {
    const [podium, setPodium] = useState({
        first: '',
        second: '',
        third: '',
    });

    // Función para actualizar la posición seleccionada
    const handleSelection = (position, value) => {
        const updatedPodium = { ...podium, [position]: value };
        setPodium(updatedPodium);

        onPodiumChange(category, updatedPodium);
    };

    // Función para generar las opciones excluyendo los ya seleccionados
    const getFilteredOptions = (position) => {
        const usedRiders = Object.values(podium).filter(
            (p) => p !== '' && p !== podium[position]
        );
        return riders
            .filter((rider) => !usedRiders.includes(rider.riderID))
            .sort((a, b) => a.fullName.localeCompare(b.fullName));
    };

    return (
        <div>
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <div>
                <label>Primero: </label>
                <select
                    value={podium.first}
                    onChange={(e) => handleSelection('first', e.target.value)}
                >
                    <option value=''>Seleccionar</option>
                    {getFilteredOptions('first').map((rider) => (
                        <option key={rider._id} value={rider.riderID}>
                            {rider.fullName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Segundo: </label>
                <select
                    value={podium.second}
                    onChange={(e) => handleSelection('second', e.target.value)}
                >
                    <option value=''>Seleccionar</option>
                    {getFilteredOptions('second').map((rider) => (
                        <option key={rider._id} value={rider.riderID}>
                            {rider.fullName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Tercero: </label>
                <select
                    value={podium.third}
                    onChange={(e) => handleSelection('third', e.target.value)}
                >
                    <option value=''>Seleccionar</option>
                    {getFilteredOptions('third').map((rider) => (
                        <option key={rider._id} value={rider.riderID}>
                            {rider.fullName}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
