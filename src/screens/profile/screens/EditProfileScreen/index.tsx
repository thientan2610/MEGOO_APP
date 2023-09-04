import {Formik} from 'formik';
import {observer} from 'mobx-react';
import moment from 'moment';
import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import {dateFormat, dateISOFormat} from '../../../../common/handle.string';
import userStore from '../../../../common/store/user.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {IEditInfoRes} from './interfaces/edit.info.interface';
import {
  editInfo,
  updateAvatar,
  uploadAvatarWithBase64,
} from './services/edit.info.service';
import styles from './styles/styles';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Vui lòng nhập họ tên'),
  phone: Yup.string()
    .optional()
    .min(10, 'Số điện thoại không hợp lệ')
    .max(12, 'Số điện thoại không hợp lệ')
    .matches(/^(\+84)|0([3|5|7|8|9])(\d{8})$/, 'Số điện thoại không hợp lệ'),
});

const EditProfileScreen = ({navigation}: {navigation: any}) => {
  const dobISOString = dateISOFormat(userStore.dob ? userStore.dob : '');
  const [date, setDate] = useState(
    dobISOString !== null ? new Date(dobISOString) : new Date(),
  );

  console.log('date:', date);

  const [selectedImage, setSelectedImage] = useState('');
  const [imageFile, setImageFile] = useState<any>();

  const [open, setOpen] = useState(false);

  const initialValues = {
    email: userStore.email,
    name: userStore.name,
    phone: userStore.phone,
    dob: userStore.dob,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ProfileSchema}
      onSubmit={async values => {
        // If user change info then call API and update user store
        if (values.name !== userStore.name) {
          console.log('edit name');
          editInfo({
            name: values.name,
          })
            .then((response: IEditInfoRes) => {
              console.log(response.message);
              if (response.statusCode === 200) {
                Toast.show({
                  type: 'success',
                  text1: 'Sửa thông tin thành công',
                  autoHide: true,
                  visibilityTime: 1000,
                  topOffset: 20,
                  bottomOffset: 40,
                  onHide: () => {
                    navigation.navigate(
                      RouteNames.PROFILE as never,
                      {} as never,
                    );
                  },
                });
                userStore.setName(response.data.name);
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
            })
            .catch(error => {
              console.log('error:', error);
            });
        }

        if (values.phone !== userStore.phone) {
          console.log('edit phone');
          editInfo({
            name: values.name,
            phone: values.phone,
          })
            .then((response: IEditInfoRes) => {
              console.log(response);
              if (response.statusCode === 200) {
                Toast.show({
                  type: 'success',
                  text1: 'Sửa thông tin thành công',
                  autoHide: true,
                  visibilityTime: 1000,
                  topOffset: 20,
                  bottomOffset: 40,
                  onHide: () => {
                    navigation.navigate(
                      RouteNames.PROFILE as never,
                      {} as never,
                    );
                  },
                });
                userStore.setPhone(response.data.phone ?? '');
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
            })
            .catch(error => {
              console.log('error:', error);
            });
        }

        if (values.dob !== userStore.dob) {
          const dobISOString = dateISOFormat(values.dob);
          console.log('edit dob');
          editInfo({
            name: values.name,
            dob: dobISOString,
          })
            .then((response: IEditInfoRes) => {
              console.log(response);
              if (response.statusCode === 200) {
                Toast.show({
                  type: 'success',
                  text1: 'Sửa thông tin thành công',
                  autoHide: true,
                  visibilityTime: 1000,
                  topOffset: 20,
                  bottomOffset: 40,
                  onHide: () => {
                    navigation.navigate(
                      RouteNames.PROFILE as never,
                      {} as never,
                    );
                  },
                });
                const dob = dateFormat(response.data.dob);
                userStore.setDob(dob ?? '');
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
            })
            .catch(error => {
              console.log('error:', error);
            });
        }

        if (selectedImage !== '') {
          const fileExtension = selectedImage.split('.').pop();
          const base64String = `data:image/${fileExtension};base64,${imageFile}`;

          const uploadResponse = await uploadAvatarWithBase64(base64String);

          console.log('uploadResponse:', uploadResponse);

          const updateResponse = await updateAvatar(
            userStore.id,
            uploadResponse.data,
          );

          console.log('updateResponse:', updateResponse);

          if (updateResponse.statusCode === 200) {
            Toast.show({
              type: 'success',
              text1: 'Sửa thông tin thành công',
              autoHide: true,
              visibilityTime: 1000,
              topOffset: 20,
              bottomOffset: 40,
              onHide: () => {
                navigation.navigate(RouteNames.PROFILE as never, {} as never);
              },
            });
            userStore.setAvatar(updateResponse.data.avatar);
          } else {
            Toast.show({
              type: 'error',
              text1: updateResponse.message,
              autoHide: false,
              topOffset: 30,
              bottomOffset: 40,
            });
          }
        }
      }}>
      {({
        values,
        errors,
        touched,
        setFieldTouched,
        setFieldValue,
        isValid,
        handleChange,
        handleSubmit,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={async () => {
              await launchImageLibrary(
                // If need base64String, include this option:
                // includeBase64: true
                {mediaType: 'mixed', includeBase64: true},
                response => {
                  // console.log('Response = ', response);

                  if (response.didCancel) {
                    console.log('User cancelled image picker');
                  } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                  } else {
                    let source: Asset[] = response.assets as Asset[];
                    setSelectedImage(`${source[0].uri}`);
                    setImageFile(source[0].base64);
                    // console.log('File:', source[0].base64);
                  }
                },
              );
            }}>
            <Image
              source={{
                uri:
                  selectedImage != ''
                    ? selectedImage
                    : userStore?.avatar || IMAGE_URI_DEFAULT,
              }}
              style={styles.avatar}
            />
            <View
              style={{
                display: 'flex',
                position: 'absolute',
                right: 20,
                bottom: 0,
              }}>
              <Icon name="camera" size={40} color={Colors.text.grey} />
            </View>
          </TouchableOpacity>

          <Text style={styles.title}>Họ và tên</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('name', value)}
              onBlur={() => setFieldTouched('name')}
              style={styles.inputText}
              placeholder={'Họ và tên'}
              placeholderTextColor={Colors.text.lightgrey}
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

          <Text style={styles.title}>Số điện thoại</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('phone', value)}
              onBlur={() => setFieldTouched('phone')}
              style={styles.inputText}
              placeholder={'Số điện thoại'}
              placeholderTextColor={Colors.text.lightgrey}
              keyboardType="phone-pad"
              value={values.phone}
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

          <Text style={styles.title}>Ngày sinh</Text>
          <View style={[styles.inputContainer]}>
            <TextInput
              editable={false}
              onBlur={() => setFieldTouched('dob')}
              style={styles.inputText}
              placeholder={'Ngày sinh'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.dob}
            />

            <DatePicker
              modal
              open={open}
              date={date}
              // maximumDate={new Date()}
              mode={'date'}
              locale={'vi'}
              title={'Chọn ngày'}
              confirmText={'Chọn'}
              cancelText={'Huỷ'}
              onConfirm={value => {
                console.log('Selected dob:', value);

                setOpen(false);
                setDate(value);
                setFieldValue('dob', moment(value).format('DD/MM/YYYY'));
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
          {/* {touched.dob && errors.dob && (
            <Text style={styles.error}>{errors.dob}</Text>
          )} */}

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
            <Text style={styles.buttonText}>Lưu thông tin</Text>
          </TouchableOpacity>

          <Toast position="top" />
        </ScrollView>
      )}
    </Formik>
  );
};

export default observer(EditProfileScreen);
