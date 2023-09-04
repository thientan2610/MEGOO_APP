import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../../../../core/config/api/api.config';

export const updateGroupName = async (groupId: string, name: string) => {
  const updateNameEndpoint = `api/pkg-mgmt/gr/${groupId}`;
  const reqUrl = `${URL_HOST}${updateNameEndpoint}`;
  console.log('Update group name:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.put(
      reqUrl,
      {
        name: name,
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
    console.log('Update group name error:', error);
  }
};

export const uploadGroupAvatarWithBase64 = async (
  groupId: string,
  base64String: string,
) => {
  const updateAvatarEndpoint = `api/file/upload-gr-avatar-with-base64/{id}${groupId}`;
  const reqUrl = `${URL_HOST}${updateAvatarEndpoint}`;
  console.log('Update group avatar:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      reqUrl,
      {
        base64: base64String,
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
    console.log('Update group avatar error:', error);
  }
};

export const updateGroupAvatar = async (
  groupId: string,
  base64String: string,
) => {
  const updateAvatarEndpoint = `api/pkg-mgmt/gr/${groupId}/avatar`;
  const reqUrl = `${URL_HOST}${updateAvatarEndpoint}`;
  console.log('Update group avatar:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const uploadResponse = await uploadGroupAvatarWithBase64(
      groupId,
      base64String,
    );
    console.log('Upload response:', uploadResponse);

    // const response = await axios.post(
    //   reqUrl,
    //   {
    //     avatar: uploadResponse.data,
    //   },
    //   {
    //     headers: {
    //       Accept: 'application/json',
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   },
    // );

    // return response.data;
  } catch (error) {
    console.log('Update group avatar error:', error);
  }
};
