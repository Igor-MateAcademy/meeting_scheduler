import React, { useState } from 'react';
import { Select, Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';

import styles from './styles.module.scss';

import { AvailabilityWindow } from 'types/AvailabilityWindow';
import { AvailableWindowProps } from 'types/AvailableWindowProps';
import { TimeInEuropeanFormat } from 'types/TimeInEuropeanFormat';

const { Option } = Select;

const weekDays = _.range(0, 7, 1);
const times = _.range(1, 12 + 1, 1);
const amTimes = times.map(time => ({
  time: time,
  format: 'AM',
}));
const pmTimes = times.map(time => ({
  time: time,
  format: 'PM',
}));

const intervalTimesForRender = amTimes.concat(pmTimes);

const AvailableWindow = (props: AvailableWindowProps) => {
  const { window, deleteWindow, getAvailabilityWindow, bookedTimeForCurrentWindow } = props;

  let bubbledWindow = window;
  const [currentWindow, setCurrentWindow] = useState<AvailabilityWindow>(window);

  const windowHandler = (formField: keyof AvailabilityWindow) => (event: string | number) => {
    setCurrentWindow({
      ...currentWindow,
      [formField]: event,
    });

    bubbledWindow = {
      ...currentWindow,
      [formField]: event,
    };

    getAvailabilityWindow(bubbledWindow);
  };

  const convertToValue = (inputObject: TimeInEuropeanFormat) => {
    const { time, format } = inputObject;
    const hour = format === 'AM' ? time : 12 + time;

    return hour * 60 * 60;
  };

  const convertFromValue = (value: number) => {
    const hour = value / 60 / 60;

    return hour > 12 ? hour - 12 : hour;
  };

  const calculateFormat = (value: number) => (value > 43200 ? 'PM' : 'AM');

  const isEqual = (a: TimeInEuropeanFormat, b: TimeInEuropeanFormat) =>
    a.time === b.time && a.format === b.format;

  const convertToFormat = (array: AvailabilityWindow[]) => {
    const converted = array.map(item => {
      const { from, to } = item;

      return [
        {
          time: convertFromValue(from),
          format: calculateFormat(from),
        },
        {
          time: convertFromValue(to),
          format: calculateFormat(to),
        },
      ];
    });

    return converted;
  };

  const isInclude = (array: TimeInEuropeanFormat[], time: TimeInEuropeanFormat) => {
    const index = array.findIndex(item => isEqual(item, time));

    return index !== -1 ? true : false;
  };

  const getAvailableTimes = (array: TimeInEuropeanFormat[]) => {
    const availableTimes = intervalTimesForRender.filter(time => !isInclude(array, time));

    return availableTimes;
  };

  const getAvailableTimesForRender = () => {
    const bookedTime = bookedTimeForCurrentWindow.find(time => time.day === window.day);

    if (bookedTime) {
      const convertedBookedTime = convertToFormat(bookedTime.bookedTime).flat(1);
      const availableTimes = getAvailableTimes(convertedBookedTime);

      return availableTimes;
    } else {
      return intervalTimesForRender;
    }
  };

  return (
    <div className={styles.range_date}>
      <Select
        className={styles.range_date_select}
        size="large"
        value={dayjs().day(currentWindow.day).format('ddd')}
        onChange={windowHandler('day')}
      >
        {weekDays.map(day => (
          <Option value={day} key={uuid()}>
            {dayjs().day(day).format('ddd')}
          </Option>
        ))}
      </Select>

      <span className={styles.range_date_text}>from</span>

      <Select
        className={styles.range_date_select}
        size="large"
        value={`${convertFromValue(currentWindow.from)} ${calculateFormat(currentWindow.from)}`}
        onChange={windowHandler('from')}
      >
        {getAvailableTimesForRender().map(dayTime => (
          <Option value={convertToValue(dayTime)} key={uuid()}>
            {`${dayTime.time} ${dayTime.format}`}
          </Option>
        ))}
      </Select>

      <span className={styles.range_date_text}>to</span>

      <Select
        className={styles.range_date_select}
        size="large"
        value={`${convertFromValue(currentWindow.to)} ${calculateFormat(currentWindow.to)}`}
        onChange={windowHandler('to')}
      >
        {getAvailableTimesForRender().map(dayTime => (
          <Option value={convertToValue(dayTime)} key={uuid()}>
            {`${dayTime.time} ${dayTime.format}`}
          </Option>
        ))}
      </Select>

      <Button
        type="text"
        size="large"
        className={styles.range_date_button}
        onClick={deleteWindow(window.id)}
        htmlType="button"
      >
        <Tooltip title="Delete">
          <DeleteOutlined className={styles.range_date_icon} />
        </Tooltip>
      </Button>
    </div>
  );
};

export default AvailableWindow;
