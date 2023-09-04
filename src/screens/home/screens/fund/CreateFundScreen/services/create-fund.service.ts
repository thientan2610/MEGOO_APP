import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../../../../../core/config/api/api.config';

export const createFund = async (
  groupId: string,
  fund: {
    summary: string;
    description: string;
    times: number;
    total: number;
    startDate: string;
    ends: string;
    members: string[];
  },
) => {
  const fundEndpoint = `api/pkg-mgmt/funding/${groupId}`;
  const reqUrl = `${URL_HOST}${fundEndpoint}`;
  console.log('Create fund:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(reqUrl, fund, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Create fund error: ', error);
  }
};
