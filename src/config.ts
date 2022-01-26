import axios from 'axios';

import { Configuration } from 'types/Configuration';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const getConfiguration = async () => {
  try {
    const { data } = await api.get<Configuration>('/configuration');

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const setConfiguration = async (data: Partial<Configuration>) => {
  try {
    await api.patch('/configuration', data);
  } catch (error) {
    console.log(error);
  }
};

export const getTime = async params => {
  try {
    const { data } = await api.get('/schedule', { params: { ...params } });

    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const scheduleMeeting = async params => {
  try {
    const response = await api.post('/schedule', { ...params });

    return response;
  } catch (error) {
    console.log(error.response);
  }
};
