import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Tooltip } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';
import SelectDay from '../../sources/images/SelectDay.gif';

import styles from './styles.module.scss';

import { MeetingTimes } from 'containers';
import { Header, Footer, Notificator } from 'components';

import { AvailableTimeForBooking } from 'types/AvailableTimeForBooking';

import { useStore } from 'stores';

import { getTime } from 'config';

const days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

const Calendar = () => {
  const { dateStore } = useStore();

  const { relevanceStartingDate, relevancePeriod } = JSON.parse(
    sessionStorage.getItem('dateLimiter')
  );
  const limitDate = dayjs(relevanceStartingDate + relevancePeriod * 1000).format('MMMM DD');

  const [sliderIndex, setSliderIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [availableTimeForBooking, setAvailableTimeForBooking] =
    useState<AvailableTimeForBooking | null>(null);

  useEffect(() => {
    getAvailableTimeForBooking();
  }, [selectedDate]);

  const getAvailableTimeForBooking = async () => {
    if (selectedDate) {
      const data = {
        interviewerId: '61dd8726136c150ddd938249',
        date: selectedDate.valueOf(),
      };

      const responseData = await getTime(data);
      console.log('responseData', responseData);

      setAvailableTimeForBooking(responseData);
    }
  };

  const buttonHandler = (dayNumber: number) => async () => {
    setSelectedDate(dateStore.date.date(dayNumber));

    const settings = {
      date: {
        day: dateStore.date.date(dayNumber).date(),
        month: dateStore.date.format('MMMM'),
      },
    };
    sessionStorage.setItem('additionalSettings', JSON.stringify(settings));
  };

  const renderPreviousMonthDays = () => {
    const date = dateStore.date.subtract(1, 'month');
    const lastDayOfPreviousMonth = date.daysInMonth();

    let lastDayOfPreviousMonthIndex = date.date(lastDayOfPreviousMonth).day() + 1;

    if (lastDayOfPreviousMonthIndex === 7) {
      lastDayOfPreviousMonthIndex = 0;
    }

    const days = _.range(
      lastDayOfPreviousMonth - lastDayOfPreviousMonthIndex + 1,
      lastDayOfPreviousMonth + 1,
      1
    );

    return days.map(previousDay => (
      <button
        className={classNames(styles.calendar_another_days, styles.calendar_current_days)}
        key={previousDay}
        type="button"
      >
        {previousDay}
      </button>
    ));
  };

  const renderCurrentMonthDays = () => {
    const { date } = dateStore;

    const lastDayOfCurrentMonth = date.daysInMonth();
    const disabledDaysCount = sliderIndex === 0 ? date.date() : 0;
    const days = _.range(1, lastDayOfCurrentMonth + 1, 1);

    return days.map(day => (
      <button
        className={classNames(
          day >= disabledDaysCount
            ? styles.calendar_current_days
            : classNames(styles.calendar_current_days, styles.disabled_day),
          selectedDate?.date() === day ? styles.is_active : ''
        )}
        key={day}
        onClick={buttonHandler(day)}
        type="button"
      >
        {day}
      </button>
    ));
  };

  const renderNextMonthDays = () => {
    const { date } = dateStore;

    const daysCountOfCurrentMonth = date.daysInMonth();
    const lastDayOfCurrentMonthIndex = date.date(daysCountOfCurrentMonth).day();

    const days = _.range(1, 7 - lastDayOfCurrentMonthIndex, 1);

    return days.map(nextDay => (
      <button
        className={classNames(styles.calendar_another_days, styles.calendar_current_days)}
        key={nextDay}
        type="button"
      >
        {nextDay}
      </button>
    ));
  };

  const sliderHandler = (action: string) => () => {
    action === 'inc'
      ? (setSliderIndex(sliderIndex + 1), dateStore.increaseDateMonth())
      : (setSliderIndex(sliderIndex - 1), dateStore.decreaseDateMonth());

    setSelectedDate(null);
  };

  return (
    <>
      <Header />
      <main className={styles.booking}>
        <div className={styles.calendar}>
          <div className={styles.container}>
            <div className={styles.calendar_navigation}>
              {sliderIndex === 0 ? (
                <Tooltip title="We cannot scheduling your meeting in the past">
                  <button
                    className={styles.slider_button}
                    onClick={sliderHandler('dec')}
                    disabled={sliderIndex <= 0}
                    type="button"
                  >
                    <LeftOutlined className={classNames(styles.arrow, styles.arrow_left)} />
                  </button>
                </Tooltip>
              ) : (
                <button
                  className={styles.slider_button}
                  onClick={sliderHandler('dec')}
                  disabled={sliderIndex <= 0}
                  type="button"
                >
                  <LeftOutlined className={classNames(styles.arrow, styles.arrow_left)} />
                </button>
              )}
              <h1 className={styles.date}>{dateStore.date.format('MMMM YYYY')}</h1>
              <button className={styles.slider_button} onClick={sliderHandler('inc')} type="button">
                <RightOutlined className={classNames(styles.arrow, styles.arrow_right)} />
              </button>
            </div>
            <div className={styles.calendar_weekdays}>
              {days.map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>
            <div className={styles.calendar_days_numbers}>
              {renderPreviousMonthDays()}
              {renderCurrentMonthDays()}
              {renderNextMonthDays()}
            </div>
          </div>
        </div>
        <div className={styles.meetings}>
          {availableTimeForBooking ? (
            <MeetingTimes availableTimes={availableTimeForBooking.options} />
          ) : (
            <Notificator
              message={`You can schedule your meetings up to ${limitDate}, just select a day`}
              icon={SelectDay}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default observer(Calendar);
