import axios from 'axios';
import qs from 'qs';

import {URL_HOST} from '../../../core/config/api/api.config';
import {
  ICreatePurchaseLocationReq,
  ICreatePurchaseLocationRes,
  IDeletePurchaseLocationReq,
  IDeletePurchaseLocationRes,
  IGetPurchaseLocationByIdReq,
  IGetPurchaseLocationByIdRes,
  IGetPurchaseLocationsPaginatedReq,
  IGetPurchaseLocationsPaginatedRes,
  IRestorePurchaseLocationByIdReq,
  IRestorePurchaseLocationByIdRes,
  IUpdatePurchaseLocationReq,
  IUpdatePurchaseLocationRes,
} from '../interfaces/purchase-locations';

/**
 * Creates a new purchase location.
 * @param reqDto The request data needed to create the purchase location.
 * @returns A promise that resolves to the created purchase location data or an error object.
 */
export const createPurchaseLocation = async (
  reqDto: ICreatePurchaseLocationReq,
): Promise<ICreatePurchaseLocationRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/purchase-locations';
  console.log('createPurchaseLocation: ', endpoint);

  try {
    const res = await axios.post<ICreatePurchaseLocationRes>(endpoint, reqDto, {
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

/**
 * Retrieves a purchase location by its ID and group ID.
 * @param reqDto The request data needed to retrieve the purchase location.
 * @returns A promise that resolves to the retrieved purchase location data or an error object.
 */
export const getPurchaseLocationById = async ({
  id,
  groupId,
}: IGetPurchaseLocationByIdReq): Promise<IGetPurchaseLocationByIdRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/purchase-locations/' + groupId! + '/' + id!;
  console.log('getPurchaseLocationById: ', endpoint);

  try {
    const res = await axios.get<IGetPurchaseLocationByIdRes>(endpoint, {
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

/**
 * Retrieves a paginated list of purchase locations based on the provided filters.
 * @param reqDto The request data needed to retrieve the paginated list of purchase locations.
 * @returns A promise that resolves to the retrieved paginated list of purchase locations data or an error object.
 */
export const getPurchaseLocationPaginated = async (
  reqDto: IGetPurchaseLocationsPaginatedReq,
): Promise<IGetPurchaseLocationsPaginatedRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/purchase-locations/' + reqDto.groupId!;
  console.log('getPurchaseLocationPaginated: ', endpoint);

  try {
    const res = await axios.get<IGetPurchaseLocationsPaginatedRes>(endpoint, {
      params: reqDto,
      validateStatus: () => true,
      paramsSerializer: params =>
        qs.stringify(params, {
          encode: false,
          allowDots: true,
        }),
    });

    return res.data;
  } catch (error) {
    console.error('getPurchaseLocationPaginated error: ', error);

    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
      data: [],
    };
  }
};

/**
 * Deletes a purchase location by its ID and group ID.
 * @param reqDto The request data needed to delete the purchase location.
 * @returns A promise that resolves to the deleted purchase location data or an error object.
 */
export const deletePurchaseLocationById = async ({
  id,
  groupId,
}: IDeletePurchaseLocationReq): Promise<IDeletePurchaseLocationRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/purchase-locations/' + groupId! + '/' + id!;

  try {
    const res = await axios.delete<IDeletePurchaseLocationRes>(endpoint, {
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

/**
 * Restores a previously deleted purchase location by its ID and group ID.
 * @param reqDto The request data needed to restore the purchase location.
 * @returns A promise that resolves to the restored purchase location data or an error object.
 */
export const restorePurchaseLocationById = async ({
  id,
  groupId,
}: IRestorePurchaseLocationByIdReq): Promise<IRestorePurchaseLocationByIdRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/purchase-locations/' + groupId! + '/' + id!;
  console.log('restorePurchaseLocationById: ', endpoint);

  try {
    const res = await axios.patch<IRestorePurchaseLocationByIdRes>(endpoint, {
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

/**
 * Updates an existing purchase location.
 * @param reqDto The request data needed to update the purchase location.
 * @returns A promise that resolves to the updated purchase location data or an error object.
 */
export const updatePurchaseLocation = async (
  reqDto: IUpdatePurchaseLocationReq,
): Promise<IUpdatePurchaseLocationRes> => {
  const endpoint =
    URL_HOST +
    'api/prod-mgmt/purchase-locations/' +
    reqDto.groupId! +
    '/' +
    reqDto.id!;
  console.log('updatePurchaseLocation', endpoint);

  try {
    const res = await axios.put<IUpdatePurchaseLocationRes>(
      endpoint,
      {
        ...reqDto,
        id: undefined,
        groupId: undefined,
      },
      {
        validateStatus: () => true,
      },
    );

    return res.data;
  } catch (error) {
    console.error(
      `updatePurchaseLocation: grId:#${reqDto.groupId!} id:#${reqDto.id!}`,
      error,
    );

    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
    };
  }
};
