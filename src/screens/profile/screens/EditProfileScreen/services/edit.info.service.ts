import axios from 'axios';
import * as base64 from 'base64-js';

import AsyncStorage from '@react-native-async-storage/async-storage';

import userStore from '../../../../../common/store/user.store';
import {URL_HOST} from '../../../../../core/config/api/api.config';
import {IEditInfoReq, IEditInfoRes} from '../interfaces/edit.info.interface';

export const editInfo = async (editInfo: IEditInfoReq) => {
  const editInfoEndpoint = `api/users/${userStore.id}`;
  const reqUrl = `${URL_HOST}${editInfoEndpoint}`;
  console.log('Edit info:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const res = await axios.put(
      reqUrl,
      {
        name: editInfo.name,
        dob: editInfo.dob ?? undefined,
        phone: editInfo.phone ?? undefined,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log(res);

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let response: IEditInfoRes = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.data.message ?? '',
      };

      if (!error?.response) {
        console.log('No Server Response');
        response.message = 'Mất kết nối với server';
      } else if (error.response?.status === 400) {
        response.message = error.response?.data.message;
      } else if (error.response?.status === 401) {
        response.message = error.response?.data.message;
      } else if (error.response?.status === 404) {
        response.message = error.response?.data;
      } else {
        console.log('Edit Failed');
        response.message = 'Chỉnh sửa không thành công';
      }
      return response;
    }
  }
};

export const uploadAvatarWithBase64 = async (base64String: string) => {
  const changeAvaEndpoint = 'api/file/upload-avatar-with-base64';
  const reqUrl = `${URL_HOST}${changeAvaEndpoint}`;
  console.log('Change avatar:', reqUrl);

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
    console.log('err:', error);
    if (axios.isAxiosError(error)) {
      let response: IEditInfoRes = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.data.message ?? '',
      };

      if (!error?.response) {
        console.log('No Server Response');
        response.message = error.response?.data.message;
      } else if (error.response?.status === 400) {
        response.message = error.response?.data.message;
      } else if (error.response?.status === 401) {
        response.message = error.response?.data.message;
      } else if (error.response?.status === 404) {
        response.message = error.response?.data.message;
      } else {
        console.log('Change Failed');
        response.message = 'Chỉnh sửa không thành công';
      }
      return response;
    }
  }
};

export const updateAvatar = async (userId: string, avatarUrl: string) => {
  const changeAvaEndpoint = `api/users/${userId}/avatar`;
  const reqUrl = `${URL_HOST}${changeAvaEndpoint}`;
  console.log('Change avatar:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      reqUrl,
      {
        avatar: avatarUrl,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log('Update avatar error:', error);
  }
};
