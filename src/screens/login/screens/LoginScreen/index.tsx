import {Formik} from 'formik';
import React, {useEffect} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
// import Provider from '@ant-design/react-native/lib/provider';
// import Toast from '@ant-design/react-native/lib/toast';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import {io} from 'socket.io-client';
import * as Yup from 'yup';

import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {dateFormat} from '../../../../common/handle.string';
import {ISettings} from '../../../../common/interfaces/settings.interface';
import {IUser} from '../../../../common/interfaces/user.interface';
import appStore from '../../../../common/store/app.store';
import userStore from '../../../../common/store/user.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {connectSocket} from '../../../../core/socket.io/socket.io';
import {
  googleSignIn,
  isUserSignedIn,
} from '../../../../services/google.service';
import {SendBirdChatService} from '../../../../services/sendbird-chat.service';
import {IGoogleLoginRes, ILoginRes} from './interfaces/login.interface';
import {login, validate} from './services/login.service';
import styles from './styles/styles';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    // .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: Yup.string().required('Vui lòng nhập mật khẩu'),
});

export default function LoginScreen({navigation}: {navigation: any}) {
  const [hidePassword, setHidePassword] = React.useState(true);

  useEffect(() => {
    // GoogleSignin.configure({
    //   scopes: [
    //     'https://www.googleapis.com/auth/userinfo.profile',
    //     'https://www.googleapis.com/auth/user.phonenumbers.read',
    //     'https://www.googleapis.com/auth/user.birthday.read',
    //   ],
    //   webClientId:
    //     '768201973051-b9supnlu237m58th9c3du0qpp3m13cgl.apps.googleusercontent.com',
    //   offlineAccess: true,
    //   forceCodeForRefreshToken: true,
    // });
    isUserSignedIn();
  }, []);

  return (
    // <Provider>
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={values => {
        login({
          username: values.email,
          password: values.password,
        }).then(async (response: ILoginRes) => {
          console.log('User info:', response?.data?.userInfo);
          console.log('Auth data:', response?.data?.auth);

          // Store user info
          let user: IUser = {
            _id: '',
            name: '',
            dob: '',
            email: '',
            phone: '',
            avatar: '',
          };

          user._id = response?.data?.userInfo['_id'] ?? '';
          user.name = response?.data?.userInfo['name'] ?? '';
          user.email = response?.data?.userInfo['email'] ?? '';
          user.phone = response?.data?.userInfo['phone'] ?? '';
          user.avatar = response?.data?.userInfo['avatar'] ?? '';
          user.dob = dateFormat(
            response?.data?.userInfo['dob'] ??
              new Date('1990-01-01T00:00:00').toString(),
          );

          userStore.setUser(user);

          // Connect socket
          connectSocket(user._id);

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

          // Store user token
          await AsyncStorage.setItem('accessToken', `${response?.accessToken}`);
          await AsyncStorage.setItem(
            'refreshToken',
            `${response?.refreshToken}`,
          );

          // Show toast message and navigate to home screen if login successfully
          if (response.statusCode === 200) {
            Toast.show({
              type: 'success',
              text1: 'Đăng nhập thành công',
              autoHide: true,
              visibilityTime: 1000,
              topOffset: 30,
              bottomOffset: 40,
              onHide: () => {
                navigation.navigate(
                  RouteNames.HOME_DRAWER as never,
                  {} as never,
                );
                appStore.setIsLoggedIn(true);
              },
            });
          } else if (response.statusCode === 401) {
            Toast.show({
              type: 'error',
              text1: response.message,
              autoHide: false,
              topOffset: 30,
              bottomOffset: 40,
            });
          } else if (response.statusCode === 404) {
            Toast.show({
              type: 'error',
              text1: response.message,
              autoHide: false,
              topOffset: 30,
              bottomOffset: 40,
            });
          } else {
            Toast.show({
              type: 'error',
              text1: response.message,
              autoHide: false,
              topOffset: 30,
              bottomOffset: 40,
            });
          }
        });
      }}>
      {({
        values,
        errors,
        touched,
        setFieldTouched,
        setFieldValue,
        isValid,
        handleSubmit,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Đăng nhập</Text>
          <View style={[styles.inputContainer]}>
            <TextInput
              onChangeText={value => setFieldValue('email', value)}
              onBlur={() => setFieldTouched('email')}
              style={styles.inputText}
              placeholder={'Email/Tên đăng nhập'}
              placeholderTextColor={Colors.border.lightgrey}
              value={values.email}
            />

            {values.email && (
              <Icon
                onPress={() => setFieldValue('email', '')}
                name={'close'}
                style={styles.inputIcon}></Icon>
            )}
          </View>
          {touched.email && errors.email && (
            <Text style={styles.error}>{errors.email}</Text>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('password', value)}
              onBlur={() => setFieldTouched('password')}
              secureTextEntry={hidePassword}
              placeholder={'Mật khẩu'}
              style={styles.inputText}
              placeholderTextColor={Colors.border.lightgrey}
              value={values.password}
            />
            {values.password && (
              <Icon
                onPress={() => setFieldValue('password', '')}
                name={'close'}
                style={[styles.inputIcon, {marginRight: 5}]}
              />
            )}
            <Icon
              onPress={() => setHidePassword(!hidePassword)}
              name={hidePassword ? 'eye' : 'eye-off'}
              style={styles.inputIcon}></Icon>
          </View>
          {touched.password && errors.password && (
            <Text style={[styles.error]}>{errors.password}</Text>
          )}

          <View
            style={{
              width: '80%',
            }}>
            <Text style={[styles.textPrimary, {textAlign: 'right'}]}>
              Quên mật khẩu?
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isValid}
            style={[
              styles.button,
              {
                backgroundColor: isValid
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.lightorange,
              },
            ]}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <Toast position="top"></Toast>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Hoặc</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => {
              googleSignIn().then(async (response: IGoogleLoginRes) => {
                console.log('GG AT:', response.data?.accessToken);
                console.log('GG RT:', response.data?.refreshToken);

                // Store user token
                await AsyncStorage.setItem(
                  'accessToken',
                  `${response.data?.accessToken}`,
                );
                await AsyncStorage.setItem(
                  'refreshToken',
                  `${response.data?.refreshToken}`,
                );
                console.log(
                  'get AT:',
                  await AsyncStorage.getItem('accessToken'),
                );

                validate().then(async res => {
                  console.log('User data:', res);

                  // Store user data
                  let user: IUser = {
                    _id: '',
                    name: '',
                    dob: '',
                    email: '',
                    phone: '',
                    avatar: '',
                  };

                  // Store user info
                  user._id = res?.userInfo?._id ?? '';
                  user.name = res?.userInfo?.name ?? '';
                  user.email = res?.userInfo?.email ?? '';
                  user.phone = res?.userInfo?.phone ?? '';
                  user.dob = dateFormat(
                    res?.userInfo?.dob ??
                      new Date('1990-01-01T00:00:00').toString(),
                  );
                  user.avatar =
                    res?.userInfo?.avatar ??
                    'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9';

                  userStore.setUser(user);

                  userStore.setAuthId(res?.auth?.user?.id);
                  userStore.setSocialAccounts(res?.auth?.user?.socialAccounts);

                  // Store user settings
                  let settings: ISettings = {
                    callNoti: true,
                    msgNoti: true,
                    stockNoti: true,
                    newsNoti: true,
                  };

                  settings.callNoti = res?.userInfo?.setting?.callNoti ?? true;
                  settings.msgNoti = res?.userInfo?.setting?.msgNoti ?? true;
                  settings.stockNoti =
                    res?.userInfo?.setting?.stockNoti ?? true;
                  settings.newsNoti = res?.userInfo?.setting?.newsNoti ?? true;

                  userStore.setUserSettings(settings);
                  console.log('Call noti:', settings.callNoti);

                  // Connect socket
                  connectSocket(user._id);

                  // Connect user to SendBird server
                  const userSendBird =
                    await SendBirdChatService.getInstance().connect(user._id);
                  console.log('userSendBird from gg login:', userSendBird);
                });
                // Show toast message and navigate to home screen if login successfully
                if (response.statusCode === 200) {
                  Toast.show({
                    type: 'success',
                    text1: 'Đăng nhập thành công',
                    autoHide: true,
                    visibilityTime: 1000,
                    topOffset: 30,
                    bottomOffset: 40,
                    onHide: () => {
                      navigation.navigate(
                        RouteNames.HOME_DRAWER as never,
                        {} as never,
                      );
                      appStore.setIsLoggedIn(true);
                    },
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: response.message,
                    autoHide: false,
                    topOffset: 30,
                    bottomOffset: 40,
                  });
                }
              });
            }}>
            <Image
              source={require('../../../../../assets/google.png')}
              style={{...styles.socialButton.image}}
            />
            <Text style={styles.text}>Tiếp tục với Google</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../../../../../assets/facebook.png')}
              style={{...styles.socialButton.image}}
            />
            <Text style={styles.text}>Tiếp tục với Facebook</Text>
          </TouchableOpacity> */}
          <View style={styles.flexRow}>
            <Text style={styles.textPrimary}>Chưa có tài khoản?</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('Đăng ký');

                navigation.navigate(RouteNames.REGISTER as never, {} as never);
              }}>
              <Text style={[styles.textPrimary, styles.registerPrimary]}>
                Đăng ký
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
    // </Provider>
  );
}
// AppRegistry.registerComponent('LoginScreen', () => LoginScreen);
