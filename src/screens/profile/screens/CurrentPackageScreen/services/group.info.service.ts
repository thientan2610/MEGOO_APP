import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../../../../core/config/api/api.config';

export const activate = async (groupId: string, pkg: Object) => {
  const activateEndpoint = `api/pkg-mgmt/gr/${groupId}/activate`;
  const reqUrl = `${URL_HOST}${activateEndpoint}`;
  console.log('Activate group:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      reqUrl,
      {
        package: pkg,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log('Activate:', error);

    if (axios.isAxiosError(error)) {
      console.log('Activate error:', error.response?.data);
    }
  }
};

export const invite = async (groupId: string, emails: string[]) => {
  const inviteEndpoint = `api/pkg-mgmt/gr/inv`;
  const reqUrl = `${URL_HOST}${inviteEndpoint}`;
  console.log('Invite:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      reqUrl,
      {
        grId: groupId,
        emails: emails,
        // feUrl: 'http://localhost:8080/pkg-mgmt/gr/join',
        feUrl: 'https://megoo.netlify.app/pgk-mgmt/gr/join',
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log('Invite error:', error);
  }
};

export const deleteMember = async (groupId: string, userId: string) => {
  const deleteMemberEndpoint = `api/pkg-mgmt/gr/${groupId}/memb`;
  const reqUrl = `${URL_HOST}${deleteMemberEndpoint}`;
  console.log('Delete member:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.delete(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        user: userId,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Delete member error:', error);
  }
};
