import React from 'react';
import { CheckOutlined } from '@ant-design/icons';

import styles from './styles.module.scss';

import { Header, Footer } from 'components';

const ConfirmedBooking = () => {
  return (
    <>
      <Header />
      <main className={styles.confirmed}>
        <div className={styles.info}>
          <CheckOutlined className={styles.icon} />
          <div className={styles.title}>Your meeting has been confirmed!</div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConfirmedBooking;
