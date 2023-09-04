import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {ICartList} from '../../../../../common/interfaces/package.interface';
import userStore from '../../../../../common/store/user.store';
import {URL_HOST} from '../../../../../core/config/api/api.config';
import {GetAllPkgRes} from '../interfaces/package.interface';

export const getAllPackage = async () => {
  const packagesEndpoint = 'api/pkg-mgmt/pkg';
  const reqUrl = `${URL_HOST}${packagesEndpoint}`;
  console.log('Get all package:', reqUrl);

  try {
    const response = await axios.get(reqUrl);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let response = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.statusText ?? '',
      };

      return response;
    }
  }
};

export const updateCart = async (cart: ICartList) => {
  const cartEndpoint = `api/users/${userStore.id}/cart`;
  const reqUrl = `${URL_HOST}${cartEndpoint}`;
  console.log('Update cart:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.put(
      reqUrl,
      {
        cart: cart.cart,
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
      } else if (error.response?.status === 400) {
        response.message = 'Dữ liệu không hợp lệ';
      } else {
        console.log('Add package Failed');
        response.message = 'Thêm vào giỏ hàng không thành công';
      }

      return response;
    }
  }
};
