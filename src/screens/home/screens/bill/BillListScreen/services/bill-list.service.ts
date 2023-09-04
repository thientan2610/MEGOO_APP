import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../../../../../core/config/api/api.config';

/**
 * Get bill list
 * @param groupId
 * @return response from server
 */
export const getBillList = async (groupId: string) => {
  const billListEndpoint = `api/pkg-mgmt/gr/${groupId}?projection=billing`;
  const reqUrl = `${URL_HOST}${billListEndpoint}`;
  console.log('Get bill list:', reqUrl);

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
    console.log('Get bill list error: ', error);
  }
};
