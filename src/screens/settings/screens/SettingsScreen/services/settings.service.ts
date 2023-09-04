import axios from 'axios';

import {URL_HOST} from '../../../../../core/config/api/api.config';
import {ILogoutRes} from '../interfaces/logout.interface';

export const logout = async (refreshToken: string) => {
  const logoutEndpoint = 'api/auth/logout';
  const reqUrl = `${URL_HOST}${logoutEndpoint}`;
  console.log('Logout:', reqUrl);

  try {
    const res = await axios.post(
      reqUrl,
      {},
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let response: ILogoutRes = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.statusText ?? '',
      };

      if (!error?.response) {
        console.log('No Server Response');
        response.message = 'Mất kết nối với server';
      } else if (error.response?.status === 400) {
        console.log('Status:', error.response?.status);
        response.message = error.response?.data;
      } else if (error.response?.status === 401) {
        console.log('Status:', error.response?.status);
        response.message = error.response?.data;
      } else if (error.response?.status === 404) {
        console.log('Status:', error.response?.status);
        response.message = error.response?.statusText;
      } else {
        console.log('Status:', error.response?.status);
        response.message = error.response?.statusText;
      }
      return response;
    }
  }
};
