import {IUser} from './user.interface';

export interface IData {
  auth: IAuthData;
  userInfo: IUser;
}

export interface IAuthData {
  id: string;
  username: string;
  role: string;
  password: string;
  hashedPassword: string;
  socialAccounts: string[];
}
