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
    { to: '/team', icon: faMotorcycle, title: 'Mi equipo' },
    { to: '/resultados', icon: faFlagCheckered, title: 'Resultados' },
    { to: '/clasificacion', icon: faRankingStar, title: 'Clasificación' },
    { to: '/genresult', icon: faCalendarPlus, title: 'Registrar resultado' },
];

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.links}>
                {links.map(({ to, icon, title }) => (
                    <NavLink
                        key={to}
                        to={to}
                        title={title}
                        className={({ isActive }) =>
                            isActive ? styles.active : styles.link
                        }
                    >
                        <FontAwesomeIcon icon={icon} />
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
