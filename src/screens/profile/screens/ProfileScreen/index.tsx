import {observer} from 'mobx-react';
import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import appStore from '../../../../common/store/app.store';
import userStore from '../../../../common/store/user.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {
  googleLink,
  signOutIfSignedInWithGG,
} from '../../../../services/google.service';
import {validate} from '../../../login/screens/LoginScreen/services/login.service';
import styles from './styles/styles';

const ProfileScreen = ({navigation}: {navigation: any}) => {
  const [selectedImages, setSelectedImages] = useState('');

  return appStore.isLoggedIn ? (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Image
        source={{
          // uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',
          uri: userStore.avatar,
        }}
        style={styles.avatar}
      /> */}

      <Image
        // source={{uri: `data:image/jpeg;base64,${userStore.avatar}`}}
        source={{uri: userStore?.avatar || IMAGE_URI_DEFAULT}}
        style={styles.avatar}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Thông tin cá nhân</Text>

        <TouchableOpacity>
          <Text
            onPress={() => {
              navigation.navigate(
                RouteNames.EDIT_PROFILE as never,
                {} as never,
              );
            }}
            style={styles.editText}>
            Chỉnh sửa
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={[styles.labelText, {width: '40%'}]}>Email:</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[styles.text, {width: '60%', textAlign: 'right'}]}>
            {userStore.email}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.labelText}>Họ tên:</Text>
          <Text style={styles.text}>{userStore.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.labelText}>Số điện thoại:</Text>
          <Text style={styles.text}>{userStore.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.labelText}>Ngày sinh:</Text>
          <Text style={styles.text}>{userStore.dob}</Text>
        </View>
      </View>

      <Text
        style={[
          styles.title,
          {
            width: '90%',
            textAlign: 'left',
            marginTop: 20,
            marginBottom: 10,
          },
        ]}>
        Tài khoản liên kết
      </Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.socialContainer}>
            <Image
              source={require('../../../../../assets/google.png')}
              style={{width: 20, height: 20}}
            />
            <Text style={styles.labelText}>Tài khoản Google</Text>
          </View>
          <TouchableOpacity
            disabled={userStore.socialAccounts.length === 0 ? false : true}
            onPress={async () => {
              // await signOutIfSignedInWithGG();
              // const response = await googleLink();

              // console.log('Google linking data:', response);

              // if (response?.status === 201) {
              //   Toast.show({
              //     type: 'success',
              //     text1: 'Liên kết với tài khoản Google thành công',
              //     autoHide: true,
              //     visibilityTime: 1000,
              //   });
              // }
              const validateResponse = await validate();
              console.log(validateResponse?.auth?.user?.socialAccounts);
            }}>
            {userStore.socialAccounts.length === 0 ? (
              <Text style={styles.connectText}>Liên kết</Text>
            ) : (
              <Text style={styles.connectText}>Đã liên kết</Text>
            )}
          </TouchableOpacity>
        </View>
        {/* <View style={styles.infoRow}>
          <View style={styles.socialContainer}>
            <Image
              source={require('../../../../../assets/facebook.png')}
              style={{width: 20, height: 20}}
            />
            <Text style={styles.text}>Tài khoản Facebook</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.connectText}>Liên kết</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ScrollView>
  ) : (
    <View style={styles.loginContainer}>
      <Image
        source={require('../../../../../assets/food.png')}
        style={{
          width: '100%',
          height: 100,
          // backgroundColor: Colors.border.lightgrey,
          resizeMode: 'center',
          marginBottom: 50,
        }}
      />
      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>Vui lòng </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(RouteNames.LOGIN, {});
          }}>
          <Text style={[styles.loginText, {color: Colors.text.orange}]}>
            đăng nhập/đăng ký
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.loginText}>để sử dụng chức năng này.</Text>
    </View>
  );
};

export default observer(ProfileScreen);
