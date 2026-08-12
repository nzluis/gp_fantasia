import { useState } from 'react';
import styles from './Spinner.module.css';

const SPINNER_GIF = 'https://media.giphy.com/media/47RYTxR6eFLiZf5LsD/giphy.gif';

export default function Spinner() {
    const [gifFailed, setGifFailed] = useState(false);

    if (gifFailed) {
        return (
            <div className={styles.container}>
                <div className={styles.circle} aria-label='Cargando...' />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <img
                src={SPINNER_GIF}
                alt='Cargando...'
                className={styles.image}
                onError={() => setGifFailed(true)}
            />
        </div>
    );
}
