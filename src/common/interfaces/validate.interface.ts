import {IData} from './data.interface';
import {IUser} from './user.interface';

export interface IValidateRes {
  statusCode: number;
  message: string;
  data?: any;
}
