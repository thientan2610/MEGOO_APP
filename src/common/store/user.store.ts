import axios from 'axios';
import {
  action,
  extendObservable,
  makeAutoObservable,
  observable,
  reaction,
} from 'mobx';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../core/config/api/api.config';
import {ICartItem, ICartList, IPackage} from '../interfaces/package.interface';
import {ISettings} from '../interfaces/settings.interface';
import {IUser} from '../interfaces/user.interface';
import {IValidateRes} from '../interfaces/validate.interface';

class UserStore {
  @observable id = '';
  @observable name = '';
  @observable email = '';
  @observable phone = '';
  @observable dob = '';
  @observable avatar = '';

  @observable authId = '';
  @observable socialAccounts = [];

  @observable msgNoti = true;
  @observable callNoti = true;
  @observable newsNoti = true;
  @observable stockNoti = true;
  @observable billNoti = true;
  @observable todosNoti = true;
  @observable calendarNoti = true;

  @observable cartList: ICartList = {
    cart: [] as ICartItem[],
  };

  constructor() {
    // this.reset();

    makeAutoObservable(this);

    reaction(
      () => [this.msgNoti, this.stockNoti],

      async () => {
        try {
          const settingEndpoint = `api/users/${this.id}/setting`;
          const reqUrl = `${URL_HOST}${settingEndpoint}`;
          console.log('Setting:', reqUrl);

          const accessToken = await AsyncStorage.getItem('accessToken');

          const response = await axios.put(
            reqUrl,
            {
              msgNoti: this.msgNoti,
              callNoti: this.callNoti,
              newsNoti: this.newsNoti,
              stockNoti: this.stockNoti,
            },
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          console.log('Setting update res:', response.data.statusCode);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            let response: IValidateRes = {
              statusCode: error.response?.status ?? 500,
              message: error.response?.statusText ?? '',
            };

            console.log('Setting update error:', error.response?.data);
          }
        }
      },
    );
  }

  @action setUserSettings(settings: ISettings) {
    this.msgNoti = settings.msgNoti ?? this.msgNoti;
    this.stockNoti = settings.stockNoti ?? this.stockNoti;
  }

  @action setMsgNoti(state: boolean) {
    this.msgNoti = state;
  }

  @action setStockNoti(state: boolean) {
    this.stockNoti = state;
  }

  @action setBillNoti(state: boolean) {
    this.billNoti = state;
  }

  @action setTodosNoti(state: boolean) {
    this.todosNoti = state;
  }

  @action setCalendarNoti(state: boolean) {
    this.calendarNoti = state;
  }

  @action setUser(user: IUser) {
    this.id = user._id ?? this.id;
    this.name = user.name ?? this.name;
    this.email = user.email ?? this.email;
    this.phone = user.phone ?? this.phone;
    this.dob = user.dob ?? this.dob;
    this.avatar = user.avatar ?? this.avatar;
  }

  @action setName(name: string) {
    this.name = name;
  }

  @action setPhone(phone: string) {
    this.phone = phone;
  }

  @action setEmail(email: string) {
    this.email = email;
  }

  @action setDob(dob: string) {
    this.dob = dob;
  }

  @action setAvatar(avatar: string) {
    this.avatar = avatar;
  }

  @action setAuthId(authId: string) {
    this.authId = authId;
  }

  @action setSocialAccounts(socialAccounts: []) {
    for (let i = 0; i < socialAccounts.length; i++) {
      this.socialAccounts.push(socialAccounts[i]);
    }
  }

  @action setCartList(list: ICartList) {
    this.cartList = list;
  }

  @action addCartItem(item: ICartItem) {
    this.cartList.cart.push(item);
  }

  @action resetArray() {
    this.cartList.cart = []; // Assigning an empty array to reset the observable array
  }

  @action resetStore() {
    this.id = '';
    this.name = '';
    this.email = '';
    this.phone = '';
    this.dob = '';
    this.avatar = '';
    this.msgNoti = true;
    this.billNoti = true;
    this.todosNoti = true;
    this.calendarNoti = true;
    this.stockNoti = true;
    this.cartList = {
      cart: [],
    };
  }
}

const userStore = new UserStore();
export default userStore;
