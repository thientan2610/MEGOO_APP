import {useCallback, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {GroupChannel} from '@sendbird/chat/groupChannel';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import groupStore from '../../../../common/store/group.store';
import userStore from '../../../../common/store/user.store';
import RouteNames from '../../../../constants/route-names.const';
import {getUserGroup} from '../../../../services/group.service';
import {SendBirdChatService} from '../../../../services/sendbird-chat.service';
import styles from './styles/style';
import {Colors} from '../../../../constants/color.const';

// const appId = 'ADD4546B-CF09-4980-B6AC-DB7FFD2E70EC';
// export const sendbird = new SendBird({appId});

const GroupChatListScreen = ({navigation}: {navigation: any}) => {
  const [groups, setGroups] = useState([]);
  const [channelUrls, setChannelUrls] = useState<string[]>([]);

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
          return {
            _id: groupItem._id ? groupItem._id : '',
            name: groupItem.name ? groupItem.name : '',
            avatar: groupItem.avatar,
            // ? groupItem.avatar
            // : 'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9',
            channelUrl: groupItem.channel ? groupItem.channel : '',
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
  };

  const getGroupChannels = async () => {
    const channelsRes = await SendBirdChatService.getInstance().getChannels();

    console.log('Get channels res:', channelsRes);
    // setChannelUrls(channelsRes.channels);

    channelsRes.groups.forEach((channelUrl: {_id: string; channel: string}) => {
      if (channelUrl?.channel) {
        SendBirdChatService.getInstance()
          .sendbird.groupChannel.getChannel(channelUrl?.channel)
          .then((groupChannel: GroupChannel) => {
            const channel = groupChannel;

            // Invite user to channel then accept invitation then join channel
            // if user is not a member of channel
            const members = channel.members;
            console.log('members:', members);

            const isUserInMembersArray = members.some(
              member => member.userId === userStore.id,
            );
            console.log('isUserInMembersArray:', isUserInMembersArray);

            // if (isUserInMembersArray === false) {
            //   console.log("User isn't a member of channel");

            //   channel.inviteWithUserIds([userStore.id]).then(() => {
            //     console.log('Invite user to channel successfully');

            //     channel.acceptInvitation().then(() => {
            //       console.log('Accept invitation successfully');

            //       channel.join().then(() => {
            //         console.log('Join channel successfully');
            //       });
            //     });
            //   });
            // }
          });
      }
    });
  };

  useEffect(() => {
    getGroups();
    getGroupChannels();
  }, []);

  useEffect(() => {
    groups.map((group: any) => {
      console.log('group:', group._id);
      console.log('group:', group.channelUrl);
    });
  }, [groups]);

  const renderGroupItem = () => {
    return groups.map((group: any, index) => {
      return group.channelUrl ? (
        <TouchableOpacity
          style={styles.groupContainer}
          key={index}
          onPress={() => {
            // console.log('Group channel:', group.channelUrl);
            // console.log('Group id:', group._id);
            groupStore.setGroup(group._id, group.channelUrl);

            navigation.navigate(RouteNames.CHAT, {
              channelUrl: group.channelUrl,
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
            <Text
              style={{
                color: Colors.text.grey,
                width: '75%',
                fontWeight: 'bold',
              }}
              ellipsizeMode={'tail'}
              numberOfLines={1}>
              {group.name}
            </Text>
          </View>
        </TouchableOpacity>
      ) : null;
    });
  };

  return <View style={styles.container}>{renderGroupItem()}</View>;
};

export default GroupChatListScreen;
