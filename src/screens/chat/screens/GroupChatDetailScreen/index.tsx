import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {RouteProp, useRoute} from '@react-navigation/native';

import groupStore from '../../../../common/store/group.store';
import userStore from '../../../../common/store/user.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {getGroupById, getMembers} from '../../../../services/group.service';

type GroupChatRouteParams = {
  channelUrl: string;
  groupId: string;
};

// Specify the type for the route
type GroupChatRouteProp = RouteProp<
  Record<string, GroupChatRouteParams>,
  string
>;

const GroupChatDetailScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupChatRouteProp>();
  const {channelUrl} = route.params;
  const groupId = groupStore.id;

  const [group, setGroup] = useState<{
    _id: string;
    name: string;
    avatar: string;
    channelUrl: string;
  }>({
    _id: '',
    name: '',
    avatar: '',
    channelUrl: '',
  });

  const [members, setMembers] = useState<
    {
      _id: string;
      name: string;
      avatar: string;
      phone: string;
      email: string;
      role: string;
    }[]
  >([]);

  const getGroupMembers = async () => {
    try {
      const response = await getMembers(groupId);
      console.log('Get members response', response.group.members);

      if (
        !response.group?.members ||
        !response?.group?.members.length ||
        response?.group?.members.length === 0
      ) {
        return [];
      } else {
        setMembers(
          response.group.members.map((member: any) => {
            return {
              _id: member.user._id,
              name: member.user.name,
              avatar: member.user.avatar,
              phone: member.user.phone,
              email: member.user.email,
              role: member.role,
            };
          }),
        );
      }
    } catch (error) {
      console.log('Get members error:', error);
    }
  };

  const getGroupDetail = async () => {
    try {
      const response = await getGroupById(groupId);
      // console.log('Get group response', response);

      setGroup({
        _id: response.group._id,
        name: response.group.name,
        avatar: response.group.avatar,
        channelUrl: response.group.channel,
      });
    } catch (error) {
      console.log('Get group error:', error);
    }
  };

  useEffect(() => {
    console.log(route.params);
    getGroupDetail();
    getGroupMembers();
  }, []);

  // useEffect(() => {
  //   console.log(members);
  // }, [members]);

  useEffect(() => {
    console.log(group);
  }, [group]);

  return (
    <View style={styles.container}>
      <View style={styles.groupContainer}>
        <Image source={{uri: group?.avatar}} style={styles.groupAvatar} />

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            marginVertical: 10,
          }}>
          <Text style={styles.groupName}>{group.name}</Text>

          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 2,
              right: 15,
            }}
            onPress={() => {
              navigation.navigate(
                RouteNames.CHANGE_GROUP_CHAT_DETAIL as never,
                {
                  groupId: groupStore.id,
                  channelUrl: groupStore.channelUrl,
                },
              );
            }}>
            <AntDesignIcon name="edit" size={20} color={Colors.icon.orange} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.title}>Danh sách thành viên</Text>
      <View style={styles.memberListContainer}>
        {members.map((member, index) => {
          return (
            <View key={member._id} style={styles.memberContainer}>
              <View style={styles.memberInfoContainer}>
                <Image source={{uri: member.avatar}} style={styles.avatar} />
                <Text
                  style={
                    member.role === 'Super User'
                      ? styles.superUserName
                      : styles.memberName
                  }>
                  {member.name}
                </Text>
                {member.role === 'Super User' ? (
                  <Foundation
                    name="crown"
                    size={20}
                    color={Colors.icon.orange}
                  />
                ) : (
                  false
                )}
              </View>
              {member._id !== userStore.id ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${member.phone}`);
                  }}>
                  <Foundation
                    name="telephone"
                    size={24}
                    color={Colors.icon.orange}
                  />
                </TouchableOpacity>
              ) : (
                false
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
    paddingVertical: 20,
  },
  groupContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  groupAvatar: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    borderWidth: 1,
    borderColor: Colors.border.lightgrey,
  },
  groupName: {
    width: '80%',
    textAlign: 'center',
    fontSize: 18,
    color: Colors.title.grey,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    borderWidth: 1,
  },
  title: {
    width: '90%',
    marginVertical: 10,
    textAlign: 'left',
    fontSize: 18,
    color: Colors.title.orange,
    fontWeight: 'bold',
  },
  memberListContainer: {
    width: '90%',
    display: 'flex',
    // flexDirection: 'column',
    gap: 10,
  },
  memberContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberInfoContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  memberName: {
    fontSize: 14,
    color: Colors.text.grey,
  },
  superUserName: {
    fontSize: 14,
    color: Colors.text.orange,
    fontWeight: 'bold',
  },
});

export default GroupChatDetailScreen;
