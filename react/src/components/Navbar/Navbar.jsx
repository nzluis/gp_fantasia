import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarPlus,
    faFlagCheckered,
    faMotorcycle,
    faRankingStar,
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
    return (
        <div className={styles.nav}>
            {/* <h1>Logo</h1> */}
            <div className={styles.links}>
                <NavLink to={'/team'}>
                    <FontAwesomeIcon icon={faMotorcycle} />
                </NavLink>
                <NavLink to={'/resultados'}>
                    <FontAwesomeIcon icon={faFlagCheckered} />
                </NavLink>
                <NavLink to={'/clasificacion'}>
                    <FontAwesomeIcon icon={faRankingStar} />
                </NavLink>
                <NavLink to={'/genresult'}>
                    <FontAwesomeIcon icon={faCalendarPlus} />
                </NavLink>
            </div>
        </div>
    );
}
