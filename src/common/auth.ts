import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {io, Socket} from 'socket.io-client';

import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GroupChannel} from '@sendbird/chat/groupChannel';

import {URL_HOST} from '../core/config/api/api.config';
import {connectSocket} from '../core/socket.io/socket.io';
import {validate} from '../screens/login/screens/LoginScreen/services/login.service';
import {signOutIfSignedInWithGG} from '../services/google.service';
import {SendBirdChatService} from '../services/sendbird-chat.service';
import {dateFormat} from './handle.string';
import {ISettings} from './interfaces/settings.interface';
import {IJWTToken} from './interfaces/token.interface';
import {IUser} from './interfaces/user.interface';
import userStore from './store/user.store';

export const checkValidToken = async (token: string) => {
  // console.log("AT:", accessToken);

  const payload = jwtDecode(token) as IJWTToken;
  const isTokenExpired = Date.now() >= payload.exp * 1000;
  console.log('Date.now():', Date.now());
  console.log('Payload.exp:', payload.exp * 1000);

  return isTokenExpired;
};

export const checkLogin = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');

  let isLoggedIn = false;

  // Check if refresh token expired or not
  if (refreshToken !== null) {
    const isRefreshTokenExpired = await checkValidToken(`${refreshToken}`);
    console.log('access token:', accessToken);
    console.log('refresh token:', refreshToken);

    /**
     * If refresh token has not expired then get user info
     * then check if access token expired or not
     * ---- If access token expired -> Use refresh token to call API refresh
     * ---- Else, call validate API to get user info
     * Else if refresh token expired then ask user to login again
     */

    if (isRefreshTokenExpired === false) {
      console.log('Refresh token has not expired');
      const isAccessTokenExpired = await checkValidToken(`${accessToken}`);

      if (accessToken !== null) {
        if (isAccessTokenExpired === true) {
          console.log('Access token expired');

          try {
            const refreshEndpoint = 'api/auth/refresh';
            const reqUrl = `${URL_HOST}${refreshEndpoint}`;
            const response = await axios.get(reqUrl, {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${refreshToken}`,
              },
            });
            console.log('Res refresh token:', response.data);
            await AsyncStorage.setItem(
              'accessToken',
              response.data.accessToken,
            );
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log('Refresh api error:', error.response?.data);
            }
          }
        }

        console.log('Access token has not expired');
        const response = await validate();
        // console.log(
        //   'Validate res user id:',
        //   JSON.stringify(response.userInfo._id, null, 2),
        // );

        // Store user info
        let user: IUser = {
          _id: '',
          name: '',
          dob: '',
          email: '',
          phone: '',
          avatar: '',
        };

        user._id = response?.userInfo?._id ?? '';
        user.name = response?.userInfo?.name ?? '';
        user.email = response?.userInfo?.email ?? '';
        user.phone = response?.userInfo.phone ?? '';
        user.dob = dateFormat(
          response?.userInfo?.dob ?? new Date('1990-01-01T00:00:00'),
        );

        user.avatar =
          response.userInfo?.avatar ??
          'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9';

        userStore.setUser(user);

        userStore.setAuthId(response?.auth?.user?.id);
        userStore.setSocialAccounts(response?.auth?.user?.socialAccounts);

        // Store user settings
        let settings: ISettings = {
          callNoti: true,
          msgNoti: true,
          stockNoti: true,
          newsNoti: true,
        };

        settings.callNoti = response?.userInfo?.setting?.callNoti;
        settings.msgNoti = response?.userInfo?.setting?.msgNoti;
        settings.stockNoti = response?.userInfo?.setting?.stockNoti;
        settings.newsNoti = response?.userInfo?.setting?.newsNoti;

        userStore.setUserSettings(settings);

        console.log('User id:', user._id);

        // Connect user to SendBird server
        console.log('before connect to sendbird');
        const userConnected = await SendBirdChatService.getInstance().connect(
          user._id,
        );

        const userUpdated =
          await SendBirdChatService.getInstance().updateUserInfo(
            user.name,
            user.avatar,
          );
        console.log('userUpdated:', userUpdated);

        // Get user's SendBird's channels
        const channelsUrl =
          await SendBirdChatService.getInstance().getChannels();
        console.log('channelsUrl:', channelsUrl);

        // channelsUrl.channels.forEach((channelUrl: string) => {
        //   SendBirdChatService.getInstance()
        //     .sendbird.groupChannel.getChannel(channelUrl)
        //     .then((groupChannel: GroupChannel) => {
        //       console.log('groupChannel:', groupChannel);

        //       // Invite user to channel then accept invitation then join channel
        //       // if user is not a member of channel
        //       const members = groupChannel.members;
        //       console.log('members:', members);

        //       const isUserInMembersArray = members.some(
        //         member => member.userId === userStore.id,
        //       );
        //       console.log('isUserInMembersArray:', isUserInMembersArray);

        //       if (isUserInMembersArray === false) {
        //         console.log("User isn't a member of channel");
        //         SendBirdChatService.getInstance()
        //           .inviteUserToChannel(channelUrl, [user._id])
        //           .then(res => {
        //             console.log('Invite user to channel res:', res);
        //           });
        //       }
        //     });
        // });

        // Connect socket
        connectSocket(user._id);
      }

      isLoggedIn = true;
    } else {
      console.log('Refresh token expired');
      await signOutIfSignedInWithGG();
      isLoggedIn = false;
    }
  } else {
    await signOutIfSignedInWithGG();
    isLoggedIn = false;
  }

  return isLoggedIn;
};
