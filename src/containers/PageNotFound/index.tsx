import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import NotFound from '../../sources/images/404.jpg';

import styles from './styles.module.scss';

const PageNotFound: React.FC = () => {
  return (
    <main className={styles.container}>
      <img src={NotFound} alt="Page not found" />
      <Link to="/">
        <button className={classNames(styles.button, styles.button_red)} />
      </Link>
      <Link to="booking">
        <button className={classNames(styles.button, styles.button_blue)} />
      </Link>
    </main>
  );
};

export default PageNotFound;
