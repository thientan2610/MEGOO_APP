import {useCallback, useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import {changePackageStatusToVietnamese} from '../../../../common/handle.string';
import appStore from '../../../../common/store/app.store';
import groupStore from '../../../../common/store/group.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {getUserGroup} from '../../../../services/group.service';
import styles from './styles/style';

const GroupsScreen = ({navigation}: {navigation: any}) => {
  const [groups, setGroups] = useState([]);

  const getGroups = async () => {
    // Get all user's groups
    const groupsRes = await getUserGroup();
    if (
      !groupsRes.groups ||
      !groupsRes?.groups?.length ||
      groupsRes?.groups?.length === 0
    ) {
      return [];
    } else {
      // console.log('groupsRes:', groupsRes);

      setGroups(
        groupsRes.groups.map((groupItem: any) => {
          const currentPackage = groupItem.packages.find(
            (packageItem: any) => packageItem.status !== 'Expired',
          );

          console.log('currentPackage:', currentPackage);

          // console.log('groupItem', JSON.stringify(groupItem.packages, null, 2));

          // if(currentPackage !== undefined) {

          // }
          return {
            _id: groupItem._id ? groupItem._id : '',
            name: groupItem.name ? groupItem.name : '',
            avatar: groupItem.avatar,
            // ? groupItem.avatar
            // : 'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9',
            duration: currentPackage?.package.duration
              ? currentPackage?.package.duration
              : 0,
            noOfMember: currentPackage?.package.noOfMember
              ? currentPackage?.package.noOfMember
              : 0,
            status: currentPackage?.status ? currentPackage.status : 'Expired',
            members: groupItem.members ? groupItem.members : [],
          };
        }),
      );
    }
  };

  useEffect(() => {
    if (appStore.isLoggedIn) {
      getGroups();
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (appStore.isLoggedIn) {
        getGroups();
      }
      return () => {
        // Code to clean up the effect when the screen is unfocused
      };
    }, []),
  );

  const renderGroupItem = () => {
    return groups.map((group: any, index) => {
      const viStatus = changePackageStatusToVietnamese(group.status);

      return (
        <TouchableOpacity
          style={styles.groupContainer}
          key={index}
          onPress={() => {
            console.log('Clicked');
            groupStore.setGroupId(group._id);
            navigation.navigate(RouteNames.GROUP_TABS as never, {
              // groupId: group._id,
            });
          }}>
          <Image
            source={{
              uri: group?.avatar || IMAGE_URI_DEFAULT,
            }}
            style={styles.groupAvatar}
          />
          <View style={styles.groupInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.text}>Tên nhóm:</Text>
              <Text
                style={[styles.text, {width: '50%', fontWeight: 'bold'}]}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                {group.name}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.text}>Thời hạn:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {group.duration} tháng
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.text}>Số lượng thành viên:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {group.noOfMember}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.text}>Trạng thái:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {viStatus}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return appStore.isLoggedIn === true ? (
    <ScrollView contentContainerStyle={styles.container}>
      {renderGroupItem()}
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

export default GroupsScreen;
