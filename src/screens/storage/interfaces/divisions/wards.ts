import {IWard} from '../base-dto/ward.interface';

export interface ISearchWardsReq {
  d: number;

  q?: string;
}

export type ISearchWardsRes = IWard[];

export interface IGetWardByCodeReq {
  code: number;
}

export type IGetWardByCodeRes = IWard;
