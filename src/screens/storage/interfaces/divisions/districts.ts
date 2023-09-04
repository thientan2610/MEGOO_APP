import {IDistrict} from '../base-dto/district.interfaces';

export interface ISearchDistrictsReq {
  p: number;

  q?: string;
}

export type ISearchDistrictsRes = IDistrict[];

export interface IGetDistrictByCodeReq {
  code: number;
}

export type IGetDistrictByCodeRes = IDistrict;
