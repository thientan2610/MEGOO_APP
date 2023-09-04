import {observer} from 'mobx-react';
import {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {IMAGE_URI_DEFAULT} from '../../../../../common/default';
import groupStore from '../../../../../common/store/group.store';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {getUserGroup} from '../../../../../services/group.service';
import styles from './styles/style';

const GroupTodosListScreen = ({navigation}: {navigation: any}) => {
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

      // get all active group
      const activeGroups = groupsRes.groups.filter((groupItem: any) =>
        groupItem.packages.some((pkg: any) => pkg.status === 'Active'),
      );

      if (!activeGroups || !activeGroups.length || activeGroups.length === 0) {
        setGroups([]);
      } else {
        setGroups(
          activeGroups.map((groupItem: any) => {
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
    getGroups();
  }, []);

  const renderGroupItem = () => {
    return groups.map((group: any, index) => {
      return (
        <TouchableOpacity
          style={styles.groupContainer}
          key={index}
          onPress={() => {
            groupStore.setGroupId(group._id);
            navigation.navigate(RouteNames.TODOS_TAB, {
              groupId: group._id,
              activeTab: 'Private',
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
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderGroupItem()}
    </ScrollView>
  );
};

export default observer(GroupTodosListScreen);
