import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {RouteProp, useRoute} from '@react-navigation/native';

import groupStore from '../../../../common/store/group.store';
import {Colors} from '../../../../constants/color.const';
import {getGroupById} from '../../../../services/group.service';

type GroupChatRouteParams = {
  channelUrl: string;
  groupId: string;
};

// Specify the type for the route
type GroupChatRouteProp = RouteProp<
  Record<string, GroupChatRouteParams>,
  string
>;

const ChangeGroupChatDetailScreen = ({navigation}: {navigation: any}) => {
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
  }, []);

  useEffect(() => {
    console.log(group);
  }, [group]);

  return (
    <View style={styles.container}>
      <View style={styles.groupContainer}>
        <TouchableOpacity
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            marginVertical: 10,
          }}
          // onPress={async () => {
          //   await launchImageLibrary(
          //     // If need base64String, include this option:
          //     // includeBase64: true
          //     {mediaType: 'mixed', includeBase64: true},
          //     response => {
          //       // console.log('Response = ', response);

          //       if (response.didCancel) {
          //         console.log('User cancelled image picker');
          //       } else if (response.errorMessage) {
          //         console.log('ImagePicker Error: ', response.errorMessage);
          //       } else {
          //         let source: Asset[] = response.assets as Asset[];
          //         setSelectedImage(`${source[0].uri}`);
          //         setImageFile(source[0].base64);
          //         // console.log('File:', source[0].base64);
          //       }
          //     },
          //   );
          // }}
        >
          <Image source={{uri: group?.avatar}} style={styles.groupAvatar} />
          <View
            style={{
              display: 'flex',
              position: 'absolute',
              right: 5,
              bottom: 0,
            }}>
            <Ionicons name="camera" size={40} color={Colors.text.grey} />
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>Tên nhóm</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            placeholder={'Nhập tên nhóm'}
            placeholderTextColor={Colors.text.lightgrey}
            value={group.name}
          />
          {group.name && (
            <Ionicons
              // onPress={() => setSummary('')}
              name={'close'}
              style={styles.inputIcon}
            />
          )}
        </View>
        {!group.name && (
          <Text style={styles.error}>Vui lòng nhập tên nhóm</Text>
        )}
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
    backgroundColor: Colors.background.white,
  },
  groupContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  groupAvatar: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
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
  title: {
    width: '100%',
    marginTop: 10,
    textAlign: 'left',
    fontSize: 16,
    color: Colors.title.orange,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 15,
    // marginTop: 10,
    marginBottom: 5,
    borderColor: Colors.border.lightgrey,
    borderBottomWidth: 1,
    // borderRadius: 10,
  },
  inputIcon: {
    fontWeight: '200',
    color: Colors.icon.lightgrey,
    fontSize: 20,
  },
  inputText: {flex: 1, color: Colors.text.grey},
  error: {
    width: '90%',
    color: Colors.text.red,
    textAlign: 'left',
    marginBottom: 10,
  },
});

export default ChangeGroupChatDetailScreen;
