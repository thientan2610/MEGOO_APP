import axios from 'axios';
import qs from 'qs';

import {URL_HOST} from '../../../core/config/api/api.config';
import {
  ICreateItemReq,
  ICreateItemRes,
  IDeleteItemReq,
  IDeleteItemRes,
  IGetItemByIdReq,
  IGetItemByIdRes,
  IGetItemsPaginatedReq,
  IGetItemsPaginatedRes,
  IRestoreItemReq,
  IRestoreItemRes,
  IUpdateItemReq,
  IUpdateItemRes,
} from '../interfaces/items';

/**
 * Creates a new item.
 * @param reqDto The request data needed to create the item.
 * @returns A promise that resolves to the created item data or an error object.
 */
export const createItem = async (
  reqDto: ICreateItemReq,
): Promise<ICreateItemRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/items';
  console.log('createItem: ', endpoint);

  try {
    const res = await axios.post<ICreateItemRes>(endpoint, reqDto, {
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
 * Retrieves a item by its ID and group ID.
 * @param reqDto The request data needed to retrieve the item.
 * @returns A promise that resolves to the retrieved item data or an error object.
 */
export const getItemById = async ({
  id,
  groupId,
}: IGetItemByIdReq): Promise<IGetItemByIdRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/items/' + groupId! + '/' + id!;
  console.log('getItemById: ', endpoint);

  try {
    const res = await axios.get<IGetItemByIdRes>(endpoint, {
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
 * Retrieves a paginated list of items based on the provided filters.
 * @param reqDto The request data needed to retrieve the paginated list of items.
 * @returns A promise that resolves to the retrieved paginated list of items data or an error object.
 */
export const getItemPaginated = async (
  reqDto: IGetItemsPaginatedReq,
): Promise<IGetItemsPaginatedRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/items/' + reqDto.groupId!;
  console.log('getItemPaginated: ', endpoint);

  try {
    const res = await axios.get<IGetItemsPaginatedRes>(endpoint, {
      params: reqDto,
      paramsSerializer: params =>
        qs.stringify(params, {
          encode: false,
          allowDots: true,
        }),
    });

    return res.data;
  } catch (error) {
    console.error('getItemPaginated error: ', error);

    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
      data: (error as any)?.response?.data.data || [],
    };
  }
};

/**
 * Deletes a item by its ID and group ID.
 * @param reqDto The request data needed to delete the item.
 * @returns A promise that resolves to the deleted item data or an error object.
 */
export const deleteItemById = async ({
  id,
  groupId,
}: IDeleteItemReq): Promise<IDeleteItemRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/items/' + groupId! + '/' + id!;

  try {
    const res = await axios.delete<IDeleteItemRes>(endpoint, {
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
 * Restores a previously deleted item by its ID and group ID.
 * @param reqDto The request data needed to restore the item.
 * @returns A promise that resolves to the restored item data or an error object.
 */
export const restoreItemById = async ({
  id,
  groupId,
}: IRestoreItemReq): Promise<IRestoreItemRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/items/' + groupId! + '/' + id!;
  console.log('restoreItemById: ', endpoint);

  try {
    const res = await axios.patch<IRestoreItemRes>(endpoint, {
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
 * Updates an existing item.
 * @param reqDto The request data needed to update the item.
 * @returns A promise that resolves to the updated item data or an error object.
 */
export const updateItem = async (
  reqDto: IUpdateItemReq,
): Promise<IUpdateItemRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/items/' + reqDto.groupId! + '/' + reqDto.id!;
  console.log('updateItem', endpoint);

  try {
    const res = await axios.put<IUpdateItemRes>(
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
      `updateItem: grId:#${reqDto.groupId!} id:#${reqDto.id!}`,
      error,
    );

    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
    };
  }
};
