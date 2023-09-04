import axios from 'axios';
import qs from 'qs';

import {URL_HOST} from '../../../core/config/api/api.config';
import {
  ICreateGroupProductReq,
  ICreateGroupProductRes,
  IDeleteGroupProductReq,
  IDeleteGroupProductRes,
  IGetGroupProductByIdReq,
  IGetGroupProductByIdRes,
  IGetGroupProductsPaginatedReq,
  IGetGroupProductsPaginatedRes,
  IRestoreGroupProductByIdReq,
  IRestoreGroupProductByIdRes,
  IUpdateGroupProductReq,
  IUpdateGroupProductRes,
} from '../interfaces/group-products';

/**
 * Creates a new group product.
 * @param reqDto The request data for creating the group product.
 * @returns A promise that resolves to the response data for the created group product.
 */
export const createGroupProduct = async (
  reqDto: ICreateGroupProductReq,
): Promise<ICreateGroupProductRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/group-products';
  console.log('createGroupProduct: ', endpoint);

  try {
    const res = await axios.post<ICreateGroupProductRes>(endpoint, reqDto, {
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
export const getGroupProductById = async ({
  groupId,
  id,
}: IGetGroupProductByIdReq): Promise<IGetGroupProductByIdRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/group-products/' + groupId + '/' + id;
  console.log('getGroupProduct: ', endpoint);

  try {
    const res = await axios.get<IGetGroupProductByIdRes>(endpoint, {
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
export const getGroupProductPaginated = async (
  reqDto: IGetGroupProductsPaginatedReq,
): Promise<IGetGroupProductsPaginatedRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/group-products/' + reqDto.groupId;
  console.log('getGroupProductPaginated: ', endpoint);

  try {
    const res = await axios.get<IGetGroupProductsPaginatedRes>(endpoint, {
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
    console.error('getGroupProductPaginated error: ', error);

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
export const deleteGroupProductById = async ({
  id,
  groupId,
}: IDeleteGroupProductReq): Promise<IDeleteGroupProductRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/group-products/' + groupId + '/' + id;

  try {
    const res = await axios.delete<IDeleteGroupProductRes>(endpoint, {
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
export const restoreGroupProductById = async ({
  id,
  groupId,
}: IRestoreGroupProductByIdReq): Promise<IRestoreGroupProductByIdRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/group-products/' + groupId + '/' + id;
  console.log('restoreGroupProductById: ', endpoint);

  try {
    const res = await axios.patch<IRestoreGroupProductByIdRes>(endpoint, null, {
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
 * Updates a group product by its ID.
 * @param reqDto The request data for updating the group product.
 * @returns A promise that resolves to the response data for the updated group product.
 */
export const updateGroupProduct = async (
  reqDto: IUpdateGroupProductReq,
): Promise<IUpdateGroupProductRes> => {
  const endpoint =
    URL_HOST +
    'api/prod-mgmt/group-products/' +
    reqDto.groupId +
    '/' +
    reqDto.id;
  console.log('updateGroupProduct: ', endpoint);

  try {
    const res = await axios.put<IUpdateGroupProductRes>(
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
