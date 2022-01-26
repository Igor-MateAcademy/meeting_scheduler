import React from 'react';
import { CloseOutlined } from '@ant-design/icons';

import styles from './styles.module.scss';

import { Header, Footer } from 'components';

const NotConfirmedBooking = () => {
  return (
    <>
      <Header />
      <main className={styles.confirmed}>
        <div className={styles.info}>
          <CloseOutlined className={styles.icon} />
          <div className={styles.title}>Oops! Something went wrong. Try again later</div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotConfirmedBooking;
