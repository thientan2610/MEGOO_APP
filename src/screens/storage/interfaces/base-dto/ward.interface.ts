import {IDistrict} from './district.interfaces';

export interface IWard {
  code: number;

  name: string;

  division_type: string;

  codename: string;

  district?: IDistrict;
}
