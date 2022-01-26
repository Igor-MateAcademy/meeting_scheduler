/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import classNames from 'classnames';

import styles from './styles.module.scss';

import { Header, Footer } from 'components';

import { scheduleMeeting } from 'config';

import { useStore } from 'stores';

const ConfirmBooking = () => {
  const { dateStore } = useStore();
  const { date, timezone, startingTime } = JSON.parse(sessionStorage.getItem('additionalSettings'));
  const [isBooked, setIsBooked] = useState(null);

  const convertTo12HFormat = (value: number) => {
    return dateStore.date.second(value).format('h:mm a');
  };

  const submitMeeting = async () => {
    const response = await scheduleMeeting({
      date: dateStore.date.date(date.day).valueOf(),
      startingTime: startingTime,
      timezone: timezone,
      interviewerId: '61dd8726136c150ddd938249',
    });

    setIsBooked(response.statusText !== 'Created' ? false : true);
  };

  const buttonHandler = () => {
    submitMeeting();
  };

  return (
    <>
      <Header />
      <main className={styles.confirm}>
        <div className={styles.info}>
          <div className={styles.title}>Your meeting is scheduled for:</div>
          <div className={styles.date}>
            <span className={styles.date_bold}>{`${date.month} ${date.day}`}</span>
            {' at '}
            <span className={styles.date_bold}>{convertTo12HFormat(startingTime)}</span>
          </div>
          <div className={styles.timezone}>{`(GMT${dayjs()
            .tz(timezone)
            .format('Z')}) ${timezone}`}</div>
        </div>
        <div className={styles.action}>
          <button className={classNames(styles.button, styles.button_back)} type="button">
            <Link to="/booking" className={styles.link}>
              <LeftOutlined className={styles.arrow} />
              Back
            </Link>
          </button>
          <button className={classNames(styles.button, styles.button_confirm)} type="button">
            <Link
              to={isBooked ? '/booking/confirmed' : '/booking/not-confirmed'}
              className={styles.link}
              onClick={buttonHandler}
            >
              Confirm
            </Link>
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConfirmBooking;
