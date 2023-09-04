import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../../../../../core/config/api/api.config';

export const getFundList = async (groupId: string) => {
  const fundListEndpoint = `api/pkg-mgmt/gr/${groupId}?projection=funding`;
  const reqUrl = `${URL_HOST}${fundListEndpoint}`;
  console.log('Get fund list:', reqUrl);

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
    console.log('Get fund list error: ', error);
  }
};
