import {observer} from 'mobx-react-lite';
import * as React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';

import {Colors} from '../../../constants/color.const';
import RouteNames from '../../../constants/route-names.const';
import appStore from '../../store/app.store';
import userStore from '../../store/user.store';
import BottomNavigationBar from '../BottomNavigationBar';
import SearchComp from '../Search';
import GroupsDropdown from './groups-dropdown';

const Drawer = createDrawerNavigator();

const customDrawerContent = (props: any) => {
  const navigation = useNavigation();

  const renderGroupsDropdown = () => {
    return <GroupsDropdown />;
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        paddingTop: 0,
        // backgroundColor: Colors.itemBackground,
      }}>
      <View
        style={{
          backgroundColor: Colors.background.white,
          // height: '30%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {appStore.isLoggedIn ? (
          <React.Fragment>
            <View>
              <Image
                source={{
                  uri:
                    userStore?.avatar ||
                    'https://res.cloudinary.com/nightowls19vp/image/upload/v1687419179/default.png',
                }}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 150 / 2,
                  marginBottom: 20,
                }}
              />
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors.text.orange,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
                numberOfLines={2}>
                {userStore.name}
              </Text>
            </View>
            <View
              style={{
                marginBottom: 10,
              }}>
              {renderGroupsDropdown()}
            </View>
          </React.Fragment>
        ) : (
          <>
            <View
              style={{
                width: 150,
                height: 150,
                marginVertical: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../../../assets/logo.png')}
                style={{
                  width: '100%',
                  height: 50,
                  resizeMode: 'center',
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RouteNames.LOGIN as never);
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors.text.orange,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
                numberOfLines={2}>
                Đăng nhập/Đăng ký
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={{flex: 1}}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
};

const CustomDrawerContent = observer(customDrawerContent);

const ChatScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text>Chat screen</Text>
    </View>
  );
};

const DrawerNavigation = ({navigation}: {navigation: any}) => {
  return (
    <Drawer.Navigator
      initialRouteName={RouteNames.HOME_STACK_DRAWER}
      drawerContent={props => <CustomDrawerContent {...props} />}
      backBehavior="none"
      screenOptions={{
        drawerLabelStyle: {marginLeft: -15},
        drawerActiveTintColor: Colors.drawerItem,
        headerRight: () => {
          return (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 15,
                marginRight: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {appStore.isLoggedIn ? (
                <>
                  <SearchComp />
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Chat');
                      navigation.navigate(RouteNames.CHAT_STACK);
                      // navigation.goBack();
                    }}>
                    <Ionicons
                      // name="chatbubble-ellipses-outline"
                      name="chatbubble-ellipses-outline"
                      size={24}
                      color={'black'}
                    />
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
          );
        },
      }}>
      <Drawer.Screen
        options={{
          title: 'Megoo',
          headerTitleStyle: {fontSize: 18},
          drawerLabel: 'Trang chủ',
          drawerLabelStyle: {fontSize: 16},
          drawerIcon: ({color}) => <Icon name="home" size={20} color={color} />,
        }}
        name={RouteNames.HOME_STACK_DRAWER}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.HOME_STACK_BOTTOM}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          // headerTitleStyle: {fontSize: 18},
          drawerLabel: 'Quản lý gói',
          drawerLabelStyle: {fontSize: 16},
          drawerIcon: ({color}) => (
            <Icon name="addusergroup" size={20} color={color} />
          ),
        }}
        name={RouteNames.PACKAGE_STACK_DRAWER}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.PACKAGE_STACK_BOTTOM}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          // headerTitleStyle: {fontSize: 18},
          drawerLabel: 'Quản lý kho',
          drawerLabelStyle: {fontSize: 16},
          drawerIcon: ({color}) => <Icon name="isv" size={20} color={color} />,
        }}
        name={RouteNames.STORAGE_STACK_DRAWER}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.STORAGE_STACK_BOTTOM}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          // headerTitleStyle: {fontSize: 18},
          drawerLabelStyle: {fontSize: 16},
          drawerLabel: 'Trang cá nhân',
          drawerIcon: ({color}) => <Icon name="user" size={20} color={color} />,
        }}
        name={RouteNames.PROFILE_STACK}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.PROFILE_STACK}}
      />
      <Drawer.Screen
        options={{
          title: 'Megoo',
          // headerTitleStyle: {fontSize: 18},
          drawerLabel: 'Cài đặt',
          drawerLabelStyle: {fontSize: 16},
          drawerIcon: ({color}) => (
            <Icon name="setting" size={20} color={color} />
          ),
        }}
        name={RouteNames.SETTINGS_STACK_DRAWER}
        component={BottomNavigationBar}
        initialParams={{screen: RouteNames.SETTINGS_STACK_BOTTOM}}
      />
    </Drawer.Navigator>
  );
};
export default observer(DrawerNavigation);
