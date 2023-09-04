import axios from 'axios';

import {URL_HOST} from '../../../core/config/api/api.config';
import {
  IGetProductByBarcodeReq,
  IGetProductByBarcodeRes,
} from '../interfaces/products';

export const getProductInfoByBarcode = async ({
  barcode,
}: IGetProductByBarcodeReq): Promise<IGetProductByBarcodeRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/products/barcode/' + barcode;

  try {
    const res = await axios.get<IGetProductByBarcodeRes>(endpoint, {
      validateStatus: () => true,
    });

    return res.data;
  } catch (error) {
    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
    };
  }
};
