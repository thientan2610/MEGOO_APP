import {IData} from '../../../../../common/interfaces/data.interface';
import {IToken} from '../../../../../common/interfaces/token.interface';

export interface ILoginReq {
  username: string;
  password: string;
}

export interface ILoginRes {
  statusCode: number;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  data?: IData;
}

export interface IGoogleLoginRes {
  statusCode: number;
  message: string;
  data?: IToken;
}
