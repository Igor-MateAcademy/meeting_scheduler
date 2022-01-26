import React from 'react';
import { Routes, Route } from 'react-router-dom';

import styles from './styles.module.scss';

import {
  Calendar,
  ConfirmBooking,
  ConfirmedBooking,
  NotConfirmedBooking,
  PageNotFound,
} from 'containers';

const Booking = () => {
  return (
    <div className={styles.page}>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="confirm" element={<ConfirmBooking />} />
        <Route path="confirmed" element={<ConfirmedBooking />} />
        <Route path="not-confirmed" element={<NotConfirmedBooking />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default Booking;
