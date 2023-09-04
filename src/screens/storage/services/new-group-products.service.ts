import axios from 'axios';
import qs from 'qs';

import {URL_HOST} from '../../../core/config/api/api.config';
import {
  ICreateNewGroupProductReq,
  ICreateNewGroupProductRes,
  IDeleteNewGroupProductReq,
  IDeleteNewGroupProductRes,
  IGetNewGroupProductByIdReq,
  IGetNewGroupProductByIdRes,
  IGetNewGroupProductsPaginatedReq,
  IGetNewGroupProductsPaginatedRes,
  IRestoreNewGroupProductByIdReq,
  IRestoreNewGroupProductByIdRes,
  IUpdateNewGroupProductReq,
  IUpdateNewGroupProductRes,
} from '../interfaces/new-group-products';

/**
 * Creates a new group product.
 * @param reqDto The request data for creating the group product.
 * @returns A promise that resolves to the response data for the created group product.
 */
export const createNewGroupProduct = async (
  reqDto: ICreateNewGroupProductReq,
): Promise<ICreateNewGroupProductRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/new-group-products';
  console.log('createNewGroupProduct: ', endpoint);

  try {
    const res = await axios.post<ICreateNewGroupProductRes>(endpoint, reqDto, {
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
 * Retrieves a group product by its ID and group ID.
 * @param groupId The ID of the group that the product belongs to.
 * @param id The ID of the group product to retrieve.
 * @returns A promise that resolves to the response data for the retrieved group product.
 */
export const getNewGroupProductById = async ({
  groupId,
  id,
}: IGetNewGroupProductByIdReq): Promise<IGetNewGroupProductByIdRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/new-group-products/' + groupId + '/' + id;
  console.log('getNewGroupProduct: ', endpoint);

  try {
    const res = await axios.get<IGetNewGroupProductByIdRes>(endpoint, {
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
 * Retrieves a paginated list of group products for a given group ID.
 * @param reqDto The request data for retrieving the paginated list of group products.
 * @returns A promise that resolves to the response data for the retrieved paginated list of group products.
 */
export const getNewGroupProductPaginated = async (
  reqDto: IGetNewGroupProductsPaginatedReq,
): Promise<IGetNewGroupProductsPaginatedRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/new-group-products/' + reqDto.groupId;
  console.log('getNewGroupProductPaginated: ', endpoint);

  try {
    const res = await axios.get<IGetNewGroupProductsPaginatedRes>(endpoint, {
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
    console.error('getNewGroupProductPaginated error: ', error);

    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
      data: [],
    };
  }
};

/**
 * Deletes a group product by its ID.
 * @param id The ID of the group product to delete.
 * @returns A promise that resolves to the response data for the deleted group product.
 */
export const deleteNewGroupProductById = async ({
  id,
  groupId,
}: IDeleteNewGroupProductReq): Promise<IDeleteNewGroupProductRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/new-group-products/' + groupId + '/' + id;

  try {
    const res = await axios.delete<IDeleteNewGroupProductRes>(endpoint, {
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
 * Restores a deleted group product by its ID.
 * @param id The ID of the group product to restore.
 * @returns A promise that resolves to the response data for the restored group product.
 */
export const restoreNewGroupProductById = async ({
  id,
  groupId,
}: IRestoreNewGroupProductByIdReq): Promise<IRestoreNewGroupProductByIdRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/new-group-products/' + groupId + '/' + id;
  console.log('restoreNewGroupProductById: ', endpoint);

  try {
    const res = await axios.patch<IRestoreNewGroupProductByIdRes>(
      endpoint,
      null,
      {
        validateStatus: () => true,
      },
    );

    return res.data;
  } catch (error) {
    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
    };
  }
};

/**
 * Updates a group product by its ID.
 * @param reqDto The request data for updating the group product.
 * @returns A promise that resolves to the response data for the updated group product.
 */
export const updateNewGroupProduct = async (
  reqDto: IUpdateNewGroupProductReq,
): Promise<IUpdateNewGroupProductRes> => {
  const endpoint =
    URL_HOST +
    'api/prod-mgmt/new-group-products/' +
    reqDto.groupId +
    '/' +
    reqDto.id;
  console.log('updateNewGroupProduct: ', endpoint);

  try {
    const res = await axios.put<IUpdateNewGroupProductRes>(
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
    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
    };
  }
};
