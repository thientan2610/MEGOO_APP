import {IProvince} from '../base-dto/province.interface';

export interface ISearchProvincesReq {
  q?: string;
}

export type ISearchProvincesRes = IProvince[];

export interface IGetProvinceByCodeReq {
  code: number;
}

export type IGetProvinceByCodeRes = IProvince;
