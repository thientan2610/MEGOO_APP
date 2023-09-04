import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {ICartList} from '../../../../../common/interfaces/package.interface';
import appStore from '../../../../../common/store/app.store';
import userStore from '../../../../../common/store/user.store';
import {URL_HOST} from '../../../../../core/config/api/api.config';

export const checkout = async (cartList: ICartList, method: string) => {
  // const checkoutEndpoint = `api/users/${userStore.id}/checkout`;
  const checkoutEndpoint = `api/users/checkout`;
  const reqUrl = `${URL_HOST}${checkoutEndpoint}`;
  console.log('Checkout:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');
  console.log(cartList);

  try {
    const response = await axios.post(
      reqUrl,
      {
        cart: cartList.cart,
        method: {
          type: 'EWALLET',
          // bank_code: 'VNPAY',
          bank_code: method === 'ZALOPAY' ? 'ZALOPAY' : 'VNPAY',
        },
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
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);

      let response: any = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.data.message ?? '',
      };

      if (!error?.response) {
        console.log('No Server Response');
        response.message = 'Mất kết nối với server';
      } else {
        console.log('Checkout Failed');
        console.log('Error code:', error.response?.status);

        response.message = 'Checkout không thành công';
      }

      return response;
    }
  }
};

export const getUserById = async () => {
  const userEndpoint = `api/users/${userStore.id}`;
  const reqUrl = `${URL_HOST}${userEndpoint}`;
  console.log('Get user by id:', reqUrl);

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
    console.log('Get user by id error:', error);
  }
};

export const renew = async (pkg: {}, method: string) => {
  const renewEndpoint = `api/users/renew/${appStore.renewGroupId}`;
  const reqUrl = `${URL_HOST}${renewEndpoint}`;
  console.log('Renew:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');
  console.log('pkg renew:', pkg);

  try {
    const response = await axios.post(
      reqUrl,
      {
        method: {
          type: 'EWALLET',
          // bank_code: 'VNPAY',
          bank_code: method === 'ZALOPAY' ? 'ZALOPAY' : 'VNPAY',
        },
        cart: pkg,
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
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);

      let response: any = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.data.message ?? '',
      };

      if (!error?.response) {
        console.log('No Server Response');
        response.message = 'Mất kết nối với server';
      } else {
        console.log('Checkout Failed');
        console.log('Error code:', error.response?.status);

        response.message = 'Checkout không thành công';
      }

      return response;
    }
  }
};
