import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../../../../core/config/api/api.config';

export const getPkgsByGroupId = async (groupId: string) => {
  const groupEndpoint = `api/pkg-mgmt/gr/${groupId}`;
  const reqUrl = `${URL_HOST}${groupEndpoint}`;
  console.log('Get pkgs by groupId:', reqUrl);

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
    console.log("Get user's group error:", error);
  }
};
