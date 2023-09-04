import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../../../../../core/config/api/api.config';

export const getTaskById = async (taskId: string) => {
  const taskEndpoint = `api/pkg-mgmt/task/${taskId}`;
  const reqUrl = `${URL_HOST}${taskEndpoint}`;
  console.log('Get task by id:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.get(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Get task by id error: ', error);
  }
};

export const deleteTask = async (taskId: string) => {
  const taskEndpoint = `api/pkg-mgmt/task/${taskId}`;
  const reqUrl = `${URL_HOST}${taskEndpoint}`;
  console.log('Delete task:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.delete(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Delete task error: ', error);
  }
};

export const editTaskDetail = async (
  taskId: string,
  task: {
    summary: string;
    description: string;
    isRepeated: boolean;
    recurrence?: {
      times?: number;
      unit?: string;
      repeatOn?: string[];
      ends?: string;
    };
    startDate: string;
  },
) => {
  const taskEndpoint = `api/pkg-mgmt/task/${taskId}`;
  const reqUrl = `${URL_HOST}${taskEndpoint}`;
  console.log('Edit task:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.put(reqUrl, task, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Edit task error: ', error);
  }
};
