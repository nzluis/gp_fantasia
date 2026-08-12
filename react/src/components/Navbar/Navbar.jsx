import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarPlus,
    faFlagCheckered,
    faMotorcycle,
    faRankingStar,
} from '@fortawesome/free-solid-svg-icons';

const links = [
    { to: '/team', icon: faMotorcycle, label: 'Apuesta' },
    { to: '/resultados', icon: faFlagCheckered, label: 'Resultados' },
    { to: '/clasificacion', icon: faRankingStar, label: 'Clasificación' },
    { to: '/genresult', icon: faCalendarPlus, label: 'Subir' },
];

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.links}>
                {links.map(({ to, icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        title={label}
                        className={({ isActive }) =>
                            isActive ? styles.active : styles.link
                        }
                    >
                        <FontAwesomeIcon icon={icon} />
                        <span className={styles.label}>{label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
