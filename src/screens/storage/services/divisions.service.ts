import axios from 'axios';

import {URL_HOST} from '../../../core/config/api/api.config';
import {
  IGetDistrictByCodeReq,
  IGetDistrictByCodeRes,
  ISearchDistrictsReq,
  ISearchDistrictsRes,
} from '../interfaces/divisions/districts';
import {
  IGetProvinceByCodeReq,
  IGetProvinceByCodeRes,
  ISearchProvincesReq,
  ISearchProvincesRes,
} from '../interfaces/divisions/provinces';
import {ISearchWardsReq, ISearchWardsRes} from '../interfaces/divisions/wards';

/**
 * Searches for provinces based on the provided search criteria.
 * @param reqDto The search criteria.
 * @returns A Promise that resolves to an array of provinces that match the search criteria.
 */
export const searchProvinces = async (
  reqDto: ISearchProvincesReq,
): Promise<ISearchProvincesRes> => {
  const endpoint = URL_HOST + 'api/p';
  console.log('searchProvinces: ', endpoint);

  try {
    const res = await axios.get<ISearchProvincesRes>(endpoint, {
      validateStatus: () => true,
      params: reqDto,
    });

    return res.data;
  } catch (error) {
    console.error('searchProvinces: ', error);

    return [];
  }
};

/**
 * Retrieves a province by its code.
 * @param reqDto The code of the province to retrieve.
 * @returns A Promise that resolves to the province with the specified code, or undefined if no such province exists.
 */
export const getProvinceByCode = async (
  reqDto: IGetProvinceByCodeReq,
): Promise<IGetProvinceByCodeRes | undefined> => {
  const endpoint = URL_HOST + 'api/p/' + reqDto.code;
  console.log('getProvinceByCode: ', endpoint);

  try {
    const res = await axios.get<IGetProvinceByCodeRes>(endpoint, {
      validateStatus: () => true,
    });

    return res.data;
  } catch (error) {
    console.error('getProvinceByCode: ', error);

    return undefined;
  }
};

/**
 * Searches for districts based on the provided search criteria.
 * @param reqDto The search criteria.
 * @returns A Promise that resolves to an array of districts that match the search criteria.
 */
export const searchDistricts = async (
  reqDto: ISearchDistrictsReq,
): Promise<ISearchDistrictsRes> => {
  const endpoint = URL_HOST + 'api/d';
  console.log('searchDistricts: ', endpoint);

  try {
    const res = await axios.get<ISearchDistrictsRes>(endpoint, {
      validateStatus: () => true,
      params: reqDto,
    });

    return res.data;
  } catch (error) {
    console.error('searchDistricts: ', error);

    return [];
  }
};

/**
 * Retrieves a district by its code.
 * @param reqDto The code of the district to retrieve.
 * @returns A Promise that resolves to the district with the specified code, or undefined if no such district exists.
 */
export const getDistrictByCode = async (
  reqDto: IGetDistrictByCodeReq,
): Promise<IGetDistrictByCodeRes | undefined> => {
  const endpoint = URL_HOST + 'api/d/' + reqDto.code;
  console.log('getDistrictByCode: ', endpoint);

  try {
    const res = await axios.get<IGetDistrictByCodeRes>(endpoint, {
      validateStatus: () => true,
    });

    return res.data;
  } catch (error) {
    console.error('getDistrictByCode: ', error);

    return undefined;
  }
};

/**
 * Searches for wards based on the provided search criteria.
 * @param reqDto The search criteria.
 * @returns A Promise that resolves to an array of wards that match the search criteria.
 */
export const searchWards = async (
  reqDto: ISearchWardsReq,
): Promise<ISearchWardsRes> => {
  const endpoint = URL_HOST + 'api/w';
  console.log('searchWards: ', endpoint);

  try {
    const res = await axios.get<ISearchWardsRes>(endpoint, {
      validateStatus: () => true,
      params: reqDto,
    });

    return res.data;
  } catch (error) {
    console.error('searchWards: ', error);

    return [];
  }
};

/**
 * Retrieves a ward by its code.
 * @param reqDto The code of the ward to retrieve.
 * @returns A Promise that resolves to the ward with the specified code, or undefined if no such ward exists.
 */
export const getWardByCode = async (
  reqDto: IGetDistrictByCodeReq,
): Promise<IGetDistrictByCodeRes | undefined> => {
  const endpoint = URL_HOST + 'api/w/' + reqDto.code;
  console.log('getWardByCode: ', endpoint);

  try {
    const res = await axios.get<IGetDistrictByCodeRes>(endpoint, {
      validateStatus: () => true,
    });

    return res.data;
  } catch (error) {
    console.error('getWardByCode: ', error);

    return undefined;
  }
};
