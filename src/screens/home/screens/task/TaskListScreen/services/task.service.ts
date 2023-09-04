import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {URL_HOST} from '../../../../../../core/config/api/api.config';

export const getTaskList = async (groupId: string) => {
  const taskEndpoint = `api/pkg-mgmt/gr/${groupId}?projection=task`;
  const reqUrl = `${URL_HOST}${taskEndpoint}`;
  console.log('Get task list:', reqUrl);

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
    console.log('Get task list error: ', error);
  }
};
