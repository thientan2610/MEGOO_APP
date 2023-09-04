import {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import notifee from '@notifee/react-native';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import appStore from '../../../../common/store/app.store';
import groupStore from '../../../../common/store/group.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {getUserGroup} from '../../../../services/group.service';
import * as d from '../../services/divisions.service';
import * as gp from '../../services/group-products.service';
import * as i from '../../services/items.service';
import * as p from '../../services/product.service';
import * as pl from '../../services/purchase-locations.service';
import * as sl from '../../services/storage-location.service';
import styles from './styles/style';

const GroupProductListScreen = ({navigation}: {navigation: any}) => {
  const [groups, setGroups] = useState([]);

  const getGroups = async () => {
    if (appStore.isLoggedIn === true) {
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
            return {
              _id: groupItem._id ? groupItem._id : '',
              name: groupItem.name ? groupItem.name : '',
              avatar: groupItem.avatar,
              // ? groupItem.avatar
              // : 'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9',
              duration: groupItem.packages[0].package.duration
                ? groupItem.packages[0].package.duration
                : 0,
              noOfMember: groupItem.packages[0].package.noOfMember
                ? groupItem.packages[0].package.noOfMember
                : 0,
              status: groupItem.packages[0].status
                ? groupItem.packages[0].status
                : '',
              members: groupItem.members ? groupItem.members : [],
            };
          }),
        );
      }
    }
  };

  useEffect(() => {
    // this screen is searchable
    appStore.setSearchActive(true);

    getGroups();

    // reset searchActive when unmount
    return () => {
      appStore.setSearchActive(false);
    };
  }, []);

  const renderGroupItem = () => {
    return groups.map((group: any, index) => {
      return group.status === 'Active' ? (
        <TouchableOpacity
          style={styles.groupContainer}
          key={index}
          onPress={() => {
            console.log('Clicked');

            groupStore.setGroupId(group._id);

            navigation.navigate(RouteNames.STORAGE_TABS, {
              groupId: group._id,
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
              <Text style={styles.text}>Tên nhóm: </Text>
              <Text
                style={[styles.text, {width: '50%', fontWeight: 'bold'}]}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                {group.name}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.text}>Số lượng thành viên: </Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {group.noOfMember}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : null;
    });
  };

  return appStore.isLoggedIn ? (
    <View style={styles.container}>{renderGroupItem()}</View>
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

export default GroupProductListScreen;
