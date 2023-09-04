import {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {RouteProp, useRoute} from '@react-navigation/native';

import groupStore from '../../../../common/store/group.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {getUserGroup} from '../../../../services/group.service';
import CurrentPackage from '../CurrentPackageScreen';
import OtherPackages from '../OtherPackages';
import styles from './styles/style';

// Define the type for the route params
type GroupDetailRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupDetailRouteProp = RouteProp<
  Record<string, GroupDetailRouteParams>,
  string
>;

const GroupInfoScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupDetailRouteProp>();

  const [activeTab, setActiveTab] = useState('currentPackage');

  const [group, setGroup] = useState({
    _id: '',
    name: '',
    avatar: '',
    duration: 0,
    noOfMember: 0,
    status: '',
    members: [
      {
        role: '',
        user: '',
      },
    ],
  });

  const getSelectedGroup = async () => {
    // Get all user's groups
    const groupsRes = await getUserGroup();
    // console.log('groupsRes:', groupsRes);
    console.log('route param:', route);

    const groups = groupsRes.groups.map((groupItem: any) => {
      return {
        _id: groupItem._id ? groupItem._id : '',
        name: groupItem.name ? groupItem.name : '',
        avatar: groupItem.avatar
          ? groupItem.avatar
          : 'https://asset.cloudinary.com/nightowls19vp/52603991f890c1d52ee9bb1efebb21e9',
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
    });

    const groupId = groupStore.id;

    const selectedGroup = groups.find((group: any) => group._id === groupId);

    console.log('selectedGroup', selectedGroup);

    setGroup(selectedGroup);
  };

  useEffect(() => {
    getSelectedGroup();
  }, []);

  // const renderTabContent = () => {
  //   if (activeTab === 'currentPackage') {
  //     return <CurrentPackage navigation={navigation} />;
  //   } else if (activeTab === 'otherPackages') {
  //     return (
  //       <OtherPackages
  //         navigation={navigation}
  //         groupId={route.params?.groupId}
  //       />
  //     );
  //   }
  // };

  return (
    <View
      style={
        activeTab === 'currentPackage'
          ? [styles.container, {paddingBottom: 60}]
          : styles.container
      }>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === 'currentPackage'
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.white,
            },
          ]}
          onPress={() => {
            setActiveTab('currentPackage');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'currentPackage'
                    ? Colors.text.white
                    : Colors.text.orange,
              },
            ]}>
            Gói hiện tại
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === 'otherPackages'
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.white,
            },
          ]}
          onPress={() => {
            setActiveTab('otherPackages');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'otherPackages'
                    ? Colors.text.white
                    : Colors.text.orange,
              },
            ]}>
            Các gói khác
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{
          position: 'relative',
          top: 60,
        }}>
        {/* {renderTabContent()} */}
      </ScrollView>
    </View>
  );
};

export default GroupInfoScreen;
