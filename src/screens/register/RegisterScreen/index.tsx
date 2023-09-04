import {Formik} from 'formik';
import moment from 'moment';
import React, {useState} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {ScrollView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
// import DatePicker from "react-native-modern-datepicker";
// import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {dateFormat} from '../../../common/handle.string';
import {ISettings} from '../../../common/interfaces/settings.interface';
import {IUser} from '../../../common/interfaces/user.interface';
import userStore from '../../../common/store/user.store';
import {Colors} from '../../../constants/color.const';
import RouteNames from '../../../constants/route-names.const';
import {IGoogleLoginRes} from '../../login/screens/LoginScreen/interfaces/login.interface';
import {validate} from '../../login/screens/LoginScreen/services/login.service';
import {IRegisterReq, IRegisterRes} from './interfaces/register.interface';
import {register} from './services/register.service';
import styles from './styles/styles';
import {googleSignIn} from '../../../services/google.service';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Vui lòng nhập họ và tên'),
  // username: Yup.string()
  //   .test('username', 'Username không hợp lệ', function (value) {
  //     if (value && value.includes('@')) {
  //       return Yup.string().email('Email không hợp lệ').isValidSync(value);
  //     }
  //     return Yup.string().notRequired().isValidSync(value);
  //   })
  //   .required('Vui lòng nhập email/tên đăng nhập'),
  username: Yup.string()
    .test('username', 'Username không hợp lệ', function (value) {
      if (value && value.includes('@')) {
        return Yup.string().email('Email không hợp lệ').isValidSync(value)
          ? true
          : this.createError({message: 'Email không hợp lệ'});
      }
      return Yup.string().notRequired().isValidSync(value)
        ? true
        : this.createError({message: 'Vui lòng nhập email/tên đăng nhập'});
    })
    .required('Vui lòng nhập email/tên đăng nhập'),
  password: Yup.string()
    .min(6, 'Mật khẩu chứa ít nhất 6 kí tự')
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: Yup.string()
    .min(6, 'Mật khẩu chứa ít nhất 6 kí tự')
    .required('Vui lòng nhập lại mật khẩu'),
  phone: Yup.string()
    .max(10, 'Số điện thoại không hợp lệ')
    .matches(/^(\+84)|0([3|5|7|8|9])(\d{8})$/, 'Số điện thoại không hợp lệ')
    .required('Vui lòng nhập số điện thoại'),
  dob: Yup.string().required('Vui lòng chọn ngày sinh'),
});

export default function RegisterScreen({navigation}: {navigation: any}) {
  const [hidePassword, setHidePassword] = useState(true);
  const [date, setDate] = useState(moment().subtract(12, 'years').toDate());
  const [selectedDate, setSelectedDate] = useState(date);
  const [open, setOpen] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{flex: 1, width: '100%'}}>
        <Formik
          initialValues={{
            name: '',
            username: '',
            password: '',
            confirmPassword: '',
            phone: '',
            dob: '',
          }}
          validationSchema={RegisterSchema}
          enableReinitialize={true}
          // onSubmit={values => {}}
          onSubmit={async values => {
            const dobISOString = moment(values.dob, 'DD/MM/YYYY').toISOString();

            console.log(values);
            console.log(dobISOString);

            const response = await register({
              name: values.name,
              email: values.username,
              password: values.password,
              phone: values.phone,
              dob: dobISOString,
            });
            console.log(response.statusCode);

            if (response.statusCode === 201) {
              Toast.show({
                type: 'success',
                text1: 'Đăng ký thành công',
                autoHide: true,
                visibilityTime: 1000,
                topOffset: 30,
                bottomOffset: 40,
                onHide: () => {
                  navigation.navigate(RouteNames.LOGIN, {});
                },
              });
            } else {
              Toast.show({
                type: 'error',
                text1: response.message,
                autoHide: false,
                topOffset: 20,
              });
            }
          }}>
          {({
            values,
            errors,
            touched,
            setFieldTouched,
            setFieldValue,
            setFieldError,
            isValid,
            handleChange,
            handleSubmit,
          }) => (
            <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.title}>Đăng ký</Text>
              <View style={[styles.inputContainer]}>
                <TextInput
                  onChangeText={value => setFieldValue('name', value)}
                  onBlur={() => setFieldTouched('name')}
                  style={styles.inputText}
                  placeholderTextColor={Colors.text.lightgrey}
                  placeholder={'Họ và tên'}
                  value={values.name}
                />

                {values.name && (
                  <Icon
                    onPress={() => setFieldValue('name', '')}
                    name={'close'}
                    style={styles.inputIcon}></Icon>
                )}
              </View>
              {touched.name && errors.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}

              <View style={[styles.inputContainer]}>
                <TextInput
                  onChangeText={value => setFieldValue('username', value)}
                  onBlur={() => setFieldTouched('username')}
                  placeholder={'Email/Tên đăng nhập'}
                  style={styles.inputText}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.username}
                  keyboardType="email-address"
                />

                {values.username && (
                  <Icon
                    onPress={() => setFieldValue('username', '')}
                    name={'close'}
                    style={styles.inputIcon}></Icon>
                )}
              </View>
              {touched.username && errors.username && (
                <Text style={styles.error}>{errors.username}</Text>
              )}

              <View style={styles.inputContainer}>
                <TextInput
                  onChangeText={value => setFieldValue('password', value)}
                  onBlur={() => setFieldTouched('password')}
                  secureTextEntry={hidePassword}
                  placeholder={'Mật khẩu'}
                  style={styles.inputText}
                  placeholderTextColor={Colors.text.lightgrey}
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

              <View style={styles.inputContainer}>
                <TextInput
                  onChangeText={value =>
                    setFieldValue('confirmPassword', value)
                  }
                  onEndEditing={() => {
                    if (values.password !== values.confirmPassword) {
                      setFieldError('confirmPassword', 'Mật khẩu không khớp');
                    }
                  }}
                  onBlur={() => setFieldTouched('confirmPassword')}
                  secureTextEntry={hidePassword}
                  placeholder={'Nhập lại mật khẩu'}
                  style={styles.inputText}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.confirmPassword}
                />
                {values.confirmPassword && (
                  <Icon
                    onPress={() => setFieldValue('confirmPassword', '')}
                    name={'close'}
                    style={[styles.inputIcon, {marginRight: 5}]}
                  />
                )}
                <Icon
                  onPress={() => setHidePassword(!hidePassword)}
                  name={hidePassword ? 'eye' : 'eye-off'}
                  style={styles.inputIcon}></Icon>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={[styles.error]}>{errors.confirmPassword}</Text>
              )}

              <View style={[styles.inputContainer]}>
                <TextInput
                  onChangeText={value => setFieldValue('phone', value)}
                  onBlur={() => setFieldTouched('phone')}
                  placeholder={'Số điện thoại'}
                  style={styles.inputText}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.phone}
                  keyboardType="phone-pad"
                />

                {values.phone && (
                  <Icon
                    onPress={() => setFieldValue('phone', '')}
                    name={'close'}
                    style={styles.inputIcon}></Icon>
                )}
              </View>
              {touched.phone && errors.phone && (
                <Text style={styles.error}>{errors.phone}</Text>
              )}

              <View style={[styles.inputContainer]}>
                <TextInput
                  editable={false}
                  // onChangeText={value => setFieldValue('dob', value)}
                  onBlur={() => setFieldTouched('dob')}
                  placeholder={'Ngày sinh'}
                  style={styles.inputText}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.dob}
                />

                <DatePicker
                  modal
                  open={open}
                  date={selectedDate}
                  maximumDate={moment().subtract(12, 'years').toDate()}
                  mode={'date'}
                  locale={'vi'}
                  title={'Chọn ngày'}
                  confirmText={'Chọn'}
                  cancelText={'Huỷ'}
                  onDateChange={value => {
                    console.log('Date change value:', value);

                    setSelectedDate(value);
                  }}
                  onConfirm={value => {
                    console.log('Selected dob:', value);

                    setOpen(false);
                    setDate(value);
                    setFieldValue('dob', moment(value).format('DD/MM/YYYY'));

                    console.log('Values dob', values.dob);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />

                {values.dob && (
                  <Icon
                    onPress={() => setFieldValue('dob', '')}
                    name={'close'}
                    style={[styles.inputIcon, {marginRight: 5}]}></Icon>
                )}
                <Icon
                  onPress={() => {
                    setOpen(true);
                  }}
                  name={'calendar'}
                  style={styles.inputIcon}></Icon>
              </View>

              {touched.dob && errors.dob && (
                <Text style={styles.error}>{errors.dob}</Text>
              )}

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
                <Text style={styles.buttonText}>Đăng ký</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.textDivider}>Hoặc</Text>
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

                    validate().then(response => {
                      console.log('User data:', response.userInfo);

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
                      user._id = response.userInfo._id ?? '';
                      user.name = response.userInfo.name ?? '';
                      user.email = response.userInfo.email ?? '';
                      user.phone = response.userInfo.phone ?? '';
                      user.dob = dateFormat(response.userInfo.dob) ?? '';
                      user.avatar =
                        response.userInfo.avatar ??
                        'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9';

                      userStore.setUser(user);

                      // Store user settings
                      let settings: ISettings = {
                        callNoti: true,
                        msgNoti: true,
                        stockNoti: true,
                        newsNoti: true,
                      };

                      settings.callNoti =
                        response.userInfo.setting.callNoti ?? true;
                      settings.msgNoti =
                        response.userInfo.setting.msgNoti ?? true;
                      settings.stockNoti =
                        response.userInfo.setting.stockNoti ?? true;
                      settings.newsNoti =
                        response.userInfo.setting.newsNoti ?? true;

                      userStore.setUserSettings(settings);
                      console.log('Call noti:', settings.callNoti);
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
                <Image
                  source={require('../../../../assets/google.png')}
                  style={{...styles.socialButton.image}}
                />
                <Text style={styles.text}>Tiếp tục với Google</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require('../../../../assets/facebook.png')}
                  style={{...styles.socialButton.image}}
                />
                <Text style={styles.text}>Tiếp tục với Facebook</Text>
              </TouchableOpacity> */}
              <View style={styles.flexRow}>
                <Text style={styles.textPrimary}>Đã có tài khoản?</Text>
                <TouchableOpacity
                  onPress={() => {
                    console.log('Đăng nhập');
                    navigation.navigate(RouteNames.LOGIN, {});
                  }}>
                  <Text style={[styles.textPrimary, styles.loginPrimary]}>
                    Đăng nhập
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}
