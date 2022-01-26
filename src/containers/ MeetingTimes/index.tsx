import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import dayjs from 'dayjs';
import classNames from 'classnames';
import CanNotSchedule from '../../sources/images/CanNotSchedule.gif';

import styles from './styles.module.scss';

import { Notificator } from 'components';

import { Configuration } from 'types/Configuration';
import { MeetingTimesProps } from 'types/MeetingTimesProps';

import { useStore } from 'stores';

import { getConfiguration } from '../../config';

const defaultConfiguration = {
  title: 'null',
  duration: 0,
  timezone: 'Europe/Kiev',
  availabilityWindow: [],
  relevancePeriod: 0,
  relevanceStartingDate: 0,
  minimumNoticeTime: 0,
  bufferTime: 0,
  startTimeIncrement: 0,
};

const MeetingTimes: React.FC<MeetingTimesProps> = props => {
  const { date } = useStore().dateStore;

  const [configuration, setConfiguration] = useState<Configuration>(defaultConfiguration);
  const [isLoaded, setIsLoaded] = useState(false);
  const { availableTimes } = props;

  const loadConfiguration = async () => {
    const data = await getConfiguration();

    if (data) {
      setConfiguration(data);
    }

    setIsLoaded(true);

    return data;
  };

  useEffect(() => {
    loadConfiguration();
  }, []);

  const convertToCorrectValue = (value: number) => {
    let result;
    const hours = value / 60 / 60;

    if (hours < 1) {
      result = `${value / 60} minutes`;
    } else {
      if (value % 60 === 0) {
        result = `${hours} ${hours < 2 ? 'hour' : 'hours'}`;
      } else {
        // eslint-disable-next-line prettier/prettier
        return `${Math.trunc(hours)} ${value / 60 < 2 ? 'hour' : 'hours'} ${value % 60} minutes`;
      }
    }

    return result;
  };

  const convertTo12HFormat = (value: number) => {
    return date.second(value).format('h:mm a');
  };

  const buttonHandler = (id: number) => () => {
    const pickedTime = availableTimes.find(time => time.id === id);
    const settings = JSON.parse(sessionStorage.getItem('additionalSettings'));

    sessionStorage.setItem(
      'additionalSettings',
      JSON.stringify({
        ...settings,
        timezone: configuration.timezone,
        startingTime: pickedTime.startingTime,
      })
    );
  };

  return (
    <Skeleton loading={!isLoaded} active paragraph={{ rows: 10 }}>
      {availableTimes.length > 0 ? (
        <div className={styles.container}>
          <h3 className={styles.title}>Meeting Duration</h3>
          <div className={styles.duration}>{convertToCorrectValue(configuration.duration)}</div>
          <div className={styles.info}>
            <h3>What time works best?</h3>
            <div className={styles.timezone}>
              {`(GMT${dayjs().tz(configuration.timezone).format('Z')}) ${configuration.timezone}`}
            </div>
          </div>
          <ul className={styles.list}>
            {availableTimes.map(time => (
              <li key={time.id}>
                <button
                  type="button"
                  onClick={buttonHandler(time.id)}
                  className={classNames(
                    time.available
                      ? styles.list_item
                      : classNames(styles.list_item, styles.list_item_disabled)
                  )}
                >
                  <Link to="confirm" className={styles.link}>
                    {convertTo12HFormat(time.startingTime)}
                  </Link>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Notificator message="We cannot schedule your meeting today" icon={CanNotSchedule} />
      )}
    </Skeleton>
  );
};

export default MeetingTimes;
