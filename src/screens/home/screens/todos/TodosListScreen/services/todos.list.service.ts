import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../../../../../core/config/api/api.config';

export const getTodosList = async (groupId: string) => {
  const todosEndpoint = `api/pkg-mgmt/gr/${groupId}?projection=todos`;
  const reqUrl = `${URL_HOST}${todosEndpoint}`;
  console.log('Get todos:', reqUrl);

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
    console.log('Get todos error: ', error);
  }
};
