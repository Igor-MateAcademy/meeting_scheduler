import React from 'react';

import styles from './styles.module.scss';

import { NotificatorProps } from 'types/Notificator';

const Notificator = (props: NotificatorProps) => {
  const { message, icon } = props;

  return (
    <div className={styles.container}>
      <img src={icon} alt={message} className={styles.icon} />
      <div className={styles.message}>{message}</div>
    </div>
  );
};

export default Notificator;
