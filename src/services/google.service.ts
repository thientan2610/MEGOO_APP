import axios from 'axios';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import userStore from '../common/store/user.store';
import {URL_HOST} from '../core/config/api/api.config';
import {IGoogleLoginRes} from '../screens/login/screens/LoginScreen/interfaces/login.interface';

export const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();

    // Get user info (email, name, avatar)
    await GoogleSignin.signIn();
    const {accessToken} = await GoogleSignin.getTokens();
    console.log('GG AT:', accessToken);

    // Call API to sign up with social account
    const loginEndpoint = 'api/auth/mobile/google-sign-up';
    const reqUrl = `${URL_HOST}${loginEndpoint}`;
    console.log('GG login:', reqUrl);

    const response = await axios.post(reqUrl, {
      googleAccessToken: accessToken,
    });

    // console.log("Google sign up data:", response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let response: IGoogleLoginRes = {
        statusCode: error.response?.status ?? 500,
        message: error.response?.statusText ?? '',
      };

      if (!error?.response) {
        console.log('No Server Response');
        response.message = 'Mất kết nối với server';
      } else if (error.response?.status === 400) {
        response.message = 'Dữ liệu không hợp lệ';
      } else {
        console.log('Login Failed');
        response.message = 'Đăng nhập không thành công';
      }

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Huỷ đăng nhập');
        response.message = 'Huỷ đăng nhập';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Đang đăng nhập');
        response.message = 'Đang đăng nhập';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Dịch vụ hiện không khả dụng');
        response.message = 'Dịch vụ hiện không khả dụng';
      }

      return response;
    }
  }
};

export const googleLink = async () => {
  try {
    await GoogleSignin.hasPlayServices();

    // Get user info (email, name, avatar)
    await GoogleSignin.signIn();
    const {accessToken} = await GoogleSignin.getTokens();

    // Call API to sign up with social account
    const linkEndpoint = 'api/auth/mobile/google-link';
    const reqUrl = `${URL_HOST}${linkEndpoint}`;
    console.log('GG login:', reqUrl);

    console.log('GG AT:', accessToken);
    console.log('User id from store:', userStore.authId);

    const response = await axios.post(reqUrl, {
      googleAccessToken: accessToken,
      accountId: userStore.authId,
    });

    // console.log("Google sign up data:", response.data);

    return response.data;
  } catch (error) {
    console.log('Link google account error:', error);
  }
};

export const isUserSignedIn = async () => {
  const isSignedIn = await GoogleSignin.isSignedIn();
  if (!!isSignedIn) {
    getCurrentUser();
    console.log('Get current user');
  } else {
    console.log('Please login');
  }
  return isSignedIn;
};

// Log the user out if they are currently signed in
export const signOutIfSignedInWithGG = async () => {
  const isSignedIn = await isUserSignedIn();
  if (isSignedIn) {
    await GoogleSignin.signOut();
  }
  console.log('Signed out');
};

export const getCurrentUser = async () => {
  try {
    const userInfo = await GoogleSignin.signInSilently();

    console.log('User info: ', userInfo);
    console.log('User info: ', userInfo.user.name);
    console.log('User email:', userInfo.user.email);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Message: ', error.message);
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        console.log('User has not signed in yet');
      } else {
        console.log('Some other error happened');
        console.log('Something went wrong');
      }
    }
  }
};

export const getUserBirthday = async (accessToken: string) => {
  const birthdayRes = await axios.get(
    `https://people.googleapis.com/v1/people/me?personFields=birthdays&access_token=${accessToken}`,
  );
  // console.log("birth: ", birthdayRes.data.birthdays[0].date);
  const day = birthdayRes.data.birthdays[0].date.day;
  const month = birthdayRes.data.birthdays[0].date.month;
  const year = birthdayRes.data.birthdays[0].date.year;
  const date = `${day}/${month}/${year}`;

  return date;
};

export const getUserPhoneNum = async (accessToken: string) => {
  const phoneRes = await axios.get(
    `https://people.googleapis.com/v1/people/me?personFields=phoneNumbers&access_token=${accessToken}`,
  );
  // console.log("phone: ", phoneRes.data.phoneNumbers[0].canonicalForm);
  const phone = phoneRes.data.phoneNumbers[0].canonicalForm;
  return phone;
};
