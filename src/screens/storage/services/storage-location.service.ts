import axios from 'axios';
import qs from 'qs';

import {URL_HOST} from '../../../core/config/api/api.config';
import {
  ICreateStorageLocationReq,
  ICreateStorageLocationRes,
  IDeleteStorageLocationReq,
  IDeleteStorageLocationRes,
  IGetStorageLocationByIdReq,
  IGetStorageLocationByIdRes,
  IGetStorageLocationsPaginatedReq,
  IGetStorageLocationsPaginatedRes,
  IRestoreStorageLocationByIdReq,
  IRestoreStorageLocationByIdRes,
  IUpdateStorageLocationReq,
  IUpdateStorageLocationRes,
} from '../interfaces/storage-locations';

/**
 * Creates a new storage location.
 * @param reqDto The request data needed to create the storage location.
 * @returns A promise that resolves to the created storage location data or an error object.
 */
export const createStorageLocation = async (
  reqDto: ICreateStorageLocationReq,
): Promise<ICreateStorageLocationRes> => {
  const endpoint = URL_HOST + 'api/prod-mgmt/storage-locations';
  console.log('createStorageLocation: ', endpoint);

  try {
    const res = await axios.post<ICreateStorageLocationRes>(endpoint, reqDto, {
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
 * Retrieves a storage location by its ID and group ID.
 * @param reqDto The request data needed to retrieve the storage location.
 * @returns A promise that resolves to the retrieved storage location data or an error object.
 */
export const getStorageLocationById = async ({
  id,
  groupId,
}: IGetStorageLocationByIdReq): Promise<IGetStorageLocationByIdRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/storage-locations/' + groupId! + '/' + id!;
  console.log('getStorageLocationById: ', endpoint);

  try {
    const res = await axios.get<IGetStorageLocationByIdRes>(endpoint, {
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
 * Retrieves a paginated list of storage locations based on the provided filters.
 * @param reqDto The request data needed to retrieve the paginated list of storage locations.
 * @returns A promise that resolves to the retrieved paginated list of storage locations data or an error object.
 */
export const getStorageLocationPaginated = async (
  reqDto: IGetStorageLocationsPaginatedReq,
): Promise<IGetStorageLocationsPaginatedRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/storage-locations/' + reqDto.groupId!;
  console.log('getStorageLocationPaginated: ', endpoint);

  try {
    const res = await axios.get<IGetStorageLocationsPaginatedRes>(endpoint, {
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
    console.error('getStorageLocationPaginated error: ', error);

    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
      data: [],
    };
  }
};

/**
 * Deletes a storage location by its ID and group ID.
 * @param reqDto The request data needed to delete the storage location.
 * @returns A promise that resolves to the deleted storage location data or an error object.
 */
export const deleteStorageLocationById = async ({
  id,
  groupId,
}: IDeleteStorageLocationReq): Promise<IDeleteStorageLocationRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/storage-locations/' + groupId! + '/' + id!;

  try {
    const res = await axios.delete<IDeleteStorageLocationRes>(endpoint, {
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
 * Restores a previously deleted storage location by its ID and group ID.
 * @param reqDto The request data needed to restore the storage location.
 * @returns A promise that resolves to the restored storage location data or an error object.
 */
export const restoreStorageLocationById = async ({
  id,
  groupId,
}: IRestoreStorageLocationByIdReq): Promise<IRestoreStorageLocationByIdRes> => {
  const endpoint =
    URL_HOST + 'api/prod-mgmt/storage-locations/' + groupId! + '/' + id!;
  console.log('restoreStorageLocationById: ', endpoint);

  try {
    const res = await axios.patch<IRestoreStorageLocationByIdRes>(endpoint, {
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
 * Updates an existing storage location.
 * @param reqDto The request data needed to update the storage location.
 * @returns A promise that resolves to the updated storage location data or an error object.
 */
export const updateStorageLocation = async (
  reqDto: IUpdateStorageLocationReq,
): Promise<IUpdateStorageLocationRes> => {
  const endpoint =
    URL_HOST +
    'api/prod-mgmt/storage-locations/' +
    reqDto.groupId! +
    '/' +
    reqDto.id!;
  console.log('updateStorageLocation', endpoint);

  try {
    const res = await axios.put<IUpdateStorageLocationRes>(
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
      `updateStorageLocation: grId:#${reqDto.groupId!} id:#${reqDto.id!}`,
      error,
    );

    return {
      statusCode: (error as any)?.response?.status || 500,
      message: (error as any)?.response?.data.message || 'Axios error',
    };
  }
};
