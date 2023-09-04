import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../core/config/api/api.config';

export const getUserGroup = async () => {
  const groupEndpoint = `api/pkg-mgmt/gr/user?limit=20`;
  const reqUrl = `${URL_HOST}${groupEndpoint}`;
  console.log('Get user groups:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');
  console.log('Access token:', accessToken);

  if (
    !accessToken ||
    accessToken === '' ||
    accessToken === 'null' ||
    accessToken === 'undefined'
  ) {
    return;
  }

  try {
    const response = await axios.get(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Get user's group error:", error);
  }
};

export const getGroupById = async (groupId: string) => {
  const groupEndpoint = `api/pkg-mgmt/gr/${groupId}`;
  const reqUrl = `${URL_HOST}${groupEndpoint}`;
  console.log('Get group by id:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');
  console.log('Access token:', accessToken);

  try {
    const response = await axios.get(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Get group by id error:', error);
  }
};

export const getMembers = async (groupId: string) => {
  const membersEndpoint = `api/pkg-mgmt/gr/${groupId}?projection=members`;
  const reqUrl = `${URL_HOST}${membersEndpoint}`;
  console.log('Get members:', reqUrl);

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
    console.log('Get members error: ', error);
  }
};
