import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../../../../core/config/api/api.config';
import {IProduct} from '../../../interfaces/product.interfaces';

export const addProduct = async (product: IProduct) => {
  const groupEndpoint = `api/pkg-mgmt/gr/user`;
  const reqUrl = `${URL_HOST}${groupEndpoint}`;
  console.log('Update cart:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      reqUrl,
      {
        groupId: product.groupId,
        barcode: product.barcode,
        brand: product.brand,
        category: product.category,
        description: product.description,
        image: product.image,
        name: product.name,
        price: product.price,
        region: product.region,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {}
};
