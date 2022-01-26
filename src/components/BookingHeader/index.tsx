import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../sources/images/logo.png';

import styles from './styles.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/">
        <img src={Logo} alt="company logo" className={styles.logo} />
      </Link>
      <div className={styles.info}>
        <div className={styles.title}>Meeting with Your Recruiter</div>
        <div className={styles.position}>Position Name</div>
        <div className={styles.text_tip}>Select when you would like your meeting to be.</div>
      </div>
    </header>
  );
};

export default Header;
