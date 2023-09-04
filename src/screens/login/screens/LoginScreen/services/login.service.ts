import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {IValidateRes} from '../../../../../common/interfaces/validate.interface';
import {URL_HOST} from '../../../../../core/config/api/api.config';
import {
  IGoogleLoginRes,
  ILoginReq,
  ILoginRes,
} from '../interfaces/login.interface';

export const login = async (loginInfo: ILoginReq) => {
  const loginEndpoint = 'api/auth/login/mobile';
  const reqUrl = `${URL_HOST}${loginEndpoint}`;
  console.log('Login:', reqUrl);

  try {
    const response = await axios.post(reqUrl, {
      username: loginInfo.username,
      password: loginInfo.password,
    });

    // console.log("Data:", response.data);

    return response.data;
  } catch (error) {
    console.log('Login error:', error);

    if (axios.isAxiosError(error)) {
      let response: ILoginRes = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.statusText ?? '',
      };

      if (!error?.response) {
        console.log('No Server Response');
        response.message = 'Mất kết nối với server';
      } else if (error.response?.status === 400) {
        response.message = 'Dữ liệu không hợp lệ';
      } else if (error.response?.status === 401) {
        response.message = 'Mật khẩu không chính xác';
      } else if (error.response?.status === 404) {
        response.message = 'Tài khoản không tồn tại';
      } else {
        console.log('Login Failed');
        response.message = 'Đăng nhập không thành công';
      }
      return response;
    }
  }
};

export const validate = async () => {
  const validateEndpoint = 'api/auth/validate';
  const reqUrl = `${URL_HOST}${validateEndpoint}?dt=${new Date().getTime()}`;
  console.log('Validate:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const res = await axios.get(reqUrl, {
      headers: {
        'Cache-Control': 'no-cache',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // console.log("Validate res data:", res.data);

    return res.data;
  } catch (error) {
    console.log('Validate error:', error);

    // if (axios.isAxiosError(error)) {
    //   let response: IValidateRes = {
    //     statusCode: error.response?.status ?? 500,
    //     message: error.response?.statusText ?? '',
    //   };

    //   if (!error?.response) {
    //     console.log('No Server Response');
    //     response.message = 'Mất kết nối với server';
    //   } else {
    //     console.log('Validate Failed');
    //     response.message = 'Xác thực không thành công';
    //   }
    //   return response;
    // }
  }
};
