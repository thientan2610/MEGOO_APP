import {IProvince} from './province.interface';

export interface IDistrict {
  code: number;

  name: string;

  division_type: string;

  codename: string;

  province?: IProvince;
}
