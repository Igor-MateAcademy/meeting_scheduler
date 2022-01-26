import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Input, Select, Button, Alert, Collapse, Skeleton } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { v4 as uuid } from 'uuid';
import classNames from 'classnames';

import styles from './styles.module.scss';

import { AvailableWindow } from 'components';

import { Configuration } from '../../types/Configuration';
import { AvailabilityWindow } from '../../types/AvailabilityWindow';

import { getConfiguration, setConfiguration } from '../../config';

const { Option } = Select;
const { Panel } = Collapse;

dayjs.extend(utc);
dayjs.extend(timezone);

const timezones = [
  { offset: '-11:00', label: '(GMT-11:00) Pacific/Pago_Pago', value: 'Pacific/Pago_Pago' },
  { offset: '-10:00', label: '(GMT-10:00) Pacific/Honolulu', value: 'Pacific/Honolulu' },
  { offset: '-10:00', label: '(GMT-10:00) Pacific/Tahiti', value: 'Pacific/Tahiti' },
  { offset: '-09:00', label: '(GMT-09:00) America/Anchorage', value: 'America/Anchorage' },
  { offset: '-08:00', label: '(GMT-08:00) America/Los_Angeles', value: 'America/Los_Angeles' },
  { offset: '-07:00', label: '(GMT-07:00) America/Denver', value: 'America/Denver' },
  { offset: '-06:00', label: '(GMT-06:00) America/Chicago', value: 'America/Chicago' },
  { offset: '-05:00', label: '(GMT-05:00) America/New_York', value: 'America/New_York' },
  { offset: '-04:00', label: '(GMT-04:00) America/Halifax', value: 'America/Halifax' },
  {
    offset: '-03:00',
    label: '(GMT-03:00) America/Argentina/Buenos_Aires',
    value: 'America/Argentina/Buenos_Aires',
  },
  { offset: '-03:00', label: '(GMT-03:00) America/Sao_Paulo', value: 'America/Sao_Paulo' },
  { offset: '-01:00', label: '(GMT-01:00) Atlantic/Azores', value: 'Atlantic/Azores' },
  { offset: '+00:00', label: '(GMT+00:00) Europe/London', value: 'Europe/London' },
  { offset: '+01:00', label: '(GMT+01:00) Europe/Berlin', value: 'Europe/Berlin' },
  { offset: '+02:00', label: '(GMT+02:00) Europe/Helsinki', value: 'Europe/Helsinki' },
  { offset: '+02:00', label: '(GMT+02:00) Europe/Kiev', value: 'Europe/Kiev' },
  { offset: '+03:00', label: '(GMT+03:00) Europe/Istanbul', value: 'Europe/Istanbul' },
  { offset: '+04:00', label: '(GMT+04:00) Asia/Dubai', value: 'Asia/Dubai' },
  { offset: '+04:30', label: '(GMT+04:30) Asia/Kabul', value: 'Asia/Kabul' },
  { offset: '+05:00', label: '(GMT+05:00) Indian/Maldives', value: 'Indian/Maldives' },
  { offset: '+05:30', label: '(GMT+05:30) Asia/Calcutta', value: 'Asia/Calcutta' },
  { offset: '+05:45', label: '(GMT+05:45) Asia/Kathmandu', value: 'Asia/Kathmandu' },
  { offset: '+06:00', label: '(GMT+06:00) Asia/Dhaka', value: 'Asia/Dhaka' },
  { offset: '+06:30', label: '(GMT+06:30) Indian/Cocos', value: 'Indian/Cocos' },
  { offset: '+07:00', label: '(GMT+07:00) Asia/Bangkok', value: 'Asia/Bangkok' },
  { offset: '+08:00', label: '(GMT+08:00) Asia/Hong_Kong', value: 'Asia/Hong_Kong' },
  { offset: '+09:00', label: '(GMT+09:00) Asia/Pyongyang', value: 'Asia/Pyongyang' },
  { offset: '+09:00', label: '(GMT+09:00) Asia/Tokyo', value: 'Asia/Tokyo' },
  { offset: '+09:30', label: '(GMT+09:30) Australia/Darwin', value: 'Australia/Darwin' },
  { offset: '+10:00', label: '(GMT+10:00) Australia/Brisbane', value: 'Australia/Brisbane' },
  { offset: '+10:30', label: '(GMT+10:30) Australia/Adelaide', value: 'Australia/Adelaide' },
  { offset: '+11:00', label: '(GMT+11:00) Australia/Sydney', value: 'Australia/Sydney' },
  { offset: '+12:00', label: '(GMT+12:00) Pacific/Nauru', value: 'Pacific/Nauru' },
  { offset: '+13:00', label: '(GMT+13:00) Pacific/Auckland', value: 'Pacific/Auckland' },
  { offset: '+14:00', label: '(GMT+14:00) Pacific/Kiritimati', value: 'Pacific/Kiritimati' },
];

const durations = [900, 1800, 2700, 3600, 7200];
const relevancePeriods = [1, 2, 3];
const noticeTimes = [900, 1800, 2700, 3600, 7200];
const bufferTimes = [0, 900, 1800, 2700, 3600];
const startTimeIncrement = [600, 1200, 1800, 3600];

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

const skeletonParagraphsWidth = [
  '50%',
  '50%',
  '50%',
  '50%',
  '50%',
  '50%',
  '50%',
  '50%',
  '50%',
  '50%',
];

const MeetingForm: React.FC = props => {
  const [unsavedConfiguration, setUnsavedConfiguration] =
    useState<Configuration>(defaultConfiguration);
  const [isChanged, setIsChanged] = useState({});
  const [isPageLoaded, setIsPageLoaded] = useState(true);

  const loadConfiguration = async () => {
    const data = await getConfiguration();

    if (data) {
      setUnsavedConfiguration(data);
    }

    setIsPageLoaded(false);

    return data;
  };

  const saveConfiguration = async () => {
    const changedFields = Object.keys(isChanged).map(field => [field, unsavedConfiguration[field]]);
    const changedConfiguration = Object.fromEntries(changedFields);

    Object.assign(changedConfiguration, {
      interviewerId: '61dd8726136c150ddd938249',
    });

    if (changedConfiguration.availabilityWindow) {
      let { availabilityWindow } = changedConfiguration;

      // eslint-disable-next-line no-unused-vars
      availabilityWindow = availabilityWindow.map(item => {
        delete item.id;

        return item;
      });
    }

    console.log('changedConfiguration', changedConfiguration);

    setConfiguration(changedConfiguration);
  };

  useEffect(() => {
    loadConfiguration();
  }, []);

  const defaultAvailabilityWindowConfiguration = {
    id: unsavedConfiguration.availabilityWindow.length + 1,
    day: 1,
    from: 32400,
    to: 61200,
  };

  const availabilityWindowsCountHandler = (id?: number) => () => {
    const { availabilityWindow } = unsavedConfiguration;

    if (id) {
      const availabilityWindowsWithoutDeleted = availabilityWindow.filter(
        element => element.id !== id
      );

      setUnsavedConfiguration({
        ...unsavedConfiguration,
        availabilityWindow: availabilityWindowsWithoutDeleted,
      });
    } else {
      const availabilityWindowsWithNewWindow = [...availabilityWindow];

      availabilityWindowsWithNewWindow.push(defaultAvailabilityWindowConfiguration);

      setUnsavedConfiguration({
        ...unsavedConfiguration,
        availabilityWindow: availabilityWindowsWithNewWindow,
      });
    }

    setIsChanged({
      ...isChanged,
      availabilityWindow: true,
    });
  };

  const formHandler = (formField: keyof Configuration) => (event: any) => {
    setIsChanged({
      ...isChanged,
      [formField]: true,
    });

    if (typeof event === 'object') {
      const { value } = event.target;

      setUnsavedConfiguration({
        ...unsavedConfiguration,
        [formField]: value,
      });
    } else {
      console.log(event);
      setUnsavedConfiguration({
        ...unsavedConfiguration,
        [formField]: event,
      });
    }
  };

  const buttonHandler = (action: string) => () => {
    switch (action) {
      case 'save':
        saveConfiguration();
        setIsChanged({});
        break;

      case 'cancel':
        setIsChanged({});
        break;

      case 'redirect':
        const dateLimiter = {
          relevancePeriod: unsavedConfiguration.relevancePeriod,
          relevanceStartingDate: unsavedConfiguration.relevanceStartingDate,
        };

        sessionStorage.setItem('dateLimiter', JSON.stringify(dateLimiter));
        break;

      default:
        return;
    }
  };

  const isTitleValid = () => unsavedConfiguration.title.trim().length > 0;

  const changesCount = () => {
    let count = 0;

    Object.values(isChanged).map(value => {
      if (value) {
        count++;
      }
    });

    return count;
  };

  const getAvailabilityWindow = (changedWindow: AvailabilityWindow) => {
    const windows = unsavedConfiguration.availabilityWindow;

    if (!windows.some(currentWindow => Object.is(currentWindow, changedWindow))) {
      const changedAvailabilityWindows = unsavedConfiguration.availabilityWindow.map(element => {
        if (element.id === changedWindow.id) {
          element = changedWindow;
        }

        return element;
      });

      setIsChanged({
        ...isChanged,
        availabilityWindow: true,
      });

      setUnsavedConfiguration({
        ...unsavedConfiguration,
        availabilityWindow: changedAvailabilityWindows,
      });
    }
  };

  const convertToCorrectValue = (value: number) => {
    let result;

    if (value / 60 / 60 < 1) {
      result = `${value / 60} minutes`;
    } else {
      if (value % 60 === 0) {
        result = `${value / 60 / 60} ${value / 60 / 60 < 2 ? 'hour' : 'hours'}`;
      } else {
        // eslint-disable-next-line prettier/prettier
        return `${Math.trunc(value / 60 / 60)} ${value / 60 < 2 ? 'hour' : 'hours'} ${
          value % 60
        } minutes`;
      }
    }

    return result;
  };

  const convertBookedTime = (array: AvailabilityWindow[]) =>
    array.map(item => {
      const { day } = item;

      return {
        day: day,
        bookedTime: array.filter(item => item.day === day),
      };
    });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Scheduling</h1>
      <Skeleton
        loading={isPageLoaded}
        active
        paragraph={{ rows: 10, width: skeletonParagraphsWidth }}
      >
        <form className={styles.form}>
          <h2 className={styles.text}>Title</h2>
          <Input
            className={classNames(
              isTitleValid() ? styles.input : classNames(styles.input_danger, styles.input)
            )}
            placeholder={
              isTitleValid() ? 'Enter a meeting title' : 'Title should be longer then 0 characters'
            }
            allowClear
            onChange={formHandler('title')}
            value={unsavedConfiguration.title}
          />

          <h2 className={styles.text}>Duration option</h2>
          <Select
            className={styles.select}
            size="large"
            value={unsavedConfiguration.duration}
            onChange={formHandler('duration')}
          >
            {durations.map(duration => (
              <Option value={duration} key={uuid()}>
                {convertToCorrectValue(duration)}
              </Option>
            ))}
          </Select>

          <h2 className={styles.text}>Your time zone</h2>
          <Select
            className={styles.select}
            size="large"
            value={`(GMT${dayjs().tz(unsavedConfiguration.timezone).format('Z')}) ${
              unsavedConfiguration.timezone
            }`}
            onChange={formHandler('timezone')}
          >
            {timezones.map(timezone => (
              <Option value={timezone.value} key={timezone.label}>
                {timezone.label}
              </Option>
            ))}
          </Select>

          <h2 className={styles.text}>Available Times</h2>
          {unsavedConfiguration.availabilityWindow.length === 0 ? (
            <Alert
              className={styles.alert}
              type="warning"
              message="Prospects and customers can't book meetings with you unless you add some available times."
            />
          ) : (
            unsavedConfiguration.availabilityWindow.map(window => (
              <AvailableWindow
                key={uuid()}
                deleteWindow={availabilityWindowsCountHandler}
                window={window}
                getAvailabilityWindow={getAvailabilityWindow}
                bookedTimeForCurrentWindow={convertBookedTime(
                  unsavedConfiguration.availabilityWindow
                )}
              />
            ))
          )}
          <Button
            type="text"
            onClick={availabilityWindowsCountHandler()}
            className={styles.button_add}
            htmlType="button"
          >
            <PlusSquareOutlined />
            Add hours
          </Button>

          <Collapse bordered={false} className={styles.collapse}>
            <Panel header="Additional options" key="1" className={styles.panel}>
              <h2 className={styles.text}>How far in advance can candidates book a meeting?</h2>
              <Select
                className={styles.select}
                size="large"
                value={unsavedConfiguration.relevancePeriod}
                onChange={formHandler('relevancePeriod')}
              >
                {relevancePeriods.map(period => (
                  <Option value={7 * 24 * 60 * 60 * period} key={uuid()}>{`${period} week`}</Option>
                ))}
              </Select>

              <h2 className={styles.text}>Minimum notice time</h2>
              <h4 className={styles.subtext}>
                Minimum amount of time before a meeting can be booked
              </h4>
              <Select
                className={styles.select}
                size="large"
                value={unsavedConfiguration.minimumNoticeTime}
                onChange={formHandler('minimumNoticeTime')}
              >
                {noticeTimes.map(time => (
                  <Option value={time} key={uuid()}>
                    {convertToCorrectValue(time)}
                  </Option>
                ))}
              </Select>

              <h2 className={styles.text}>Buffer time</h2>
              <h4 className={styles.subtext}>
                Padding around your meetings you can&#8217;t be booked for
              </h4>
              <Select
                className={styles.select}
                size="large"
                value={unsavedConfiguration.bufferTime}
                onChange={formHandler('bufferTime')}
              >
                {bufferTimes.map(time => (
                  <Option value={time} key={uuid()}>
                    {time === 0 ? `No buffer time` : convertToCorrectValue(time)}
                  </Option>
                ))}
              </Select>

              <h2 className={styles.text}>Start time increment</h2>
              <h4 className={styles.subtext}>Set the frequency of your meetings start times</h4>
              <Select
                className={styles.select}
                size="large"
                value={unsavedConfiguration.startTimeIncrement}
                onChange={formHandler('startTimeIncrement')}
              >
                {startTimeIncrement.map(time => (
                  <Option value={time} key={uuid()}>
                    {convertToCorrectValue(time)}
                  </Option>
                ))}
              </Select>
            </Panel>
          </Collapse>
          <Button className={styles.redirect_button} onClick={buttonHandler('redirect')}>
            <Link to="booking" className={styles.link}>
              Schedule meeting
            </Link>
          </Button>
        </form>
      </Skeleton>
      <div
        className={classNames(
          changesCount() !== 0 ? styles.bubbling_menu : styles.bubbling_menu_disabled
        )}
      >
        <div className={styles.menu_text}>{`You have made ${changesCount()} changes`}</div>
        <div className={styles.button_group}>
          <Button
            className={styles.menu_button}
            onClick={buttonHandler('save')}
            disabled={unsavedConfiguration.title.length === 0 ? true : false}
            htmlType="button"
          >
            Save
          </Button>
          <Button
            className={styles.menu_button}
            onClick={buttonHandler('cancel')}
            htmlType="button"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default observer(MeetingForm);
