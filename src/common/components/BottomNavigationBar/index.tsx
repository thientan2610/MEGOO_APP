import {observer} from 'mobx-react';
import {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Colors} from '../../../constants/color.const';
import RouteNames from '../../../constants/route-names.const';
import ChangeGroupChatDetailScreen from '../../../screens/chat/screens/ChangeGroupChatDetailScreen/index';
import ChatScreen from '../../../screens/chat/screens/ChatScreen';
import GroupChatDetailScreen from '../../../screens/chat/screens/GroupChatDetailScreen/index';
import GroupChatListScreen from '../../../screens/chat/screens/GroupChatListScreen';
import HomeScreen from '../../../screens/home';
import BillInfoScreen from '../../../screens/home/screens/bill/BillInfoScreen';
import BillListScreen from '../../../screens/home/screens/bill/BillListScreen';
import BillScreen from '../../../screens/home/screens/bill/BillScreen';
import GroupBillListScreen from '../../../screens/home/screens/bill/GroupBillListScreen';
import InterestRateScreen from '../../../screens/home/screens/interest-rate/InterestRateScreen';
import CreateTaskScreen from '../../../screens/home/screens/task/CreateTaskScreen';
import GroupTaskListScreen from '../../../screens/home/screens/task/GroupTaskListScreen';
import TaskDetailScreen from '../../../screens/home/screens/task/TaskInfoScreen';
import TaskListScreen from '../../../screens/home/screens/task/TaskListScreen';
import CreateTodosScreen from '../../../screens/home/screens/todos/CreateTodosScreen';
import GroupTodosListScreen from '../../../screens/home/screens/todos/GroupTodosListScreen';
import TodosListScreen from '../../../screens/home/screens/todos/TodosListScreen';
import TodosScreen from '../../../screens/home/screens/todos/TodosScreen';
import CartScreen from '../../../screens/package/screens/CartScreen';
import PackageScreen from '../../../screens/package/screens/PackageScreen';
import PaymentScreen from '../../../screens/package/screens/PaymentScreen';
import CurrentPackage from '../../../screens/profile/screens/CurrentPackageScreen';
import EditGroupInfoScreen from '../../../screens/profile/screens/EditGroupInfoScreen';
import EditProfileScreen from '../../../screens/profile/screens/EditProfileScreen';
import GroupsScreen from '../../../screens/profile/screens/GroupsScreen';
import OtherPackages from '../../../screens/profile/screens/OtherPackages';
import ProfileScreen from '../../../screens/profile/screens/ProfileScreen';
import AppInfoScreen from '../../../screens/settings/screens/AppInfoScreen';
import PoliciesScreen from '../../../screens/settings/screens/PoliciesScreen';
import SettingsScreen from '../../../screens/settings/screens/SettingsScreen';
import AddGroupProductScreen from '../../../screens/storage/screens/AddGroupProductScreen';
import AddProdInfoScreen from '../../../screens/storage/screens/AddProdInfoScreen';
import AddPurchaseLocationScreen from '../../../screens/storage/screens/AddPurchaseLocationScreen';
import AddStorageLocationScreen from '../../../screens/storage/screens/AddStorageLocationScreen';
import EditStorageLocationDetailScreen from '../../../screens/storage/screens/EditStorageDetailScreen';
import GroupsProductsListScreen from '../../../screens/storage/screens/GroupsScreen';
import ProductDetailScreen from '../../../screens/storage/screens/ProductDetailScreen';
import ProductsScreen from '../../../screens/storage/screens/ProductsScreen';
import PurchaseLocationScreen from '../../../screens/storage/screens/PurchaseLocationScreen';
import ScanBarcodeScreen from '../../../screens/storage/screens/ScanBarcodeScreen';
import StorageLocationDetailScreen from '../../../screens/storage/screens/StorageLocationDetailScreen';
import StorageLocationScreen from '../../../screens/storage/screens/StorageLocationScreen';
import appStore from '../../store/app.store';
import groupStore from '../../store/group.store';
import ToolTip from '../ToolTip';
import FundListScreen from '../../../screens/home/screens/fund/FundListScreen';
import CreateFundScreen from '../../../screens/home/screens/fund/CreateFundScreen';
import FundDetailScreen from '../../../screens/home/screens/fund/FundDetailScreen';
import NewGroupProductsScreen from '../../../screens/storage/screens/NewGroupProductsScreen';
import AddNewGroupProductScreen from '../../../screens/storage/screens/AddNewGroupProductScreen';

const ChatStack = createNativeStackNavigator();
const ChatScreenStack = ({navigation}: {navigation: any}) => {
  return (
    <ChatStack.Navigator initialRouteName={RouteNames.GROUP_CHATS}>
      <ChatStack.Screen
        name={RouteNames.CHAT}
        component={ChatScreen}
        options={{
          headerRight: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  console.log('Cart');
                  navigation.navigate(RouteNames.GROUP_CHAT_DETAIL as never, {
                    groupId: groupStore.id,
                    channelUrl: groupStore.channelUrl,
                  });
                }}>
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={'black'}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
      <ChatStack.Screen
        name={RouteNames.GROUP_CHATS}
        component={GroupChatListScreen}
      />
      <ChatStack.Screen
        name={RouteNames.GROUP_CHAT_DETAIL}
        component={GroupChatDetailScreen}
      />
      <ChatStack.Screen
        name={RouteNames.CHANGE_GROUP_CHAT_DETAIL}
        component={ChangeGroupChatDetailScreen}
      />
    </ChatStack.Navigator>
  );
};

const BillListStack = createNativeStackNavigator();
const BillListScreenStack = () => {
  return (
    <BillListStack.Navigator initialRouteName={RouteNames.BILL_MANAGEMENT}>
      <BillListStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
          headerShown: true,
        }}
      />
      <BillListStack.Screen
        name={RouteNames.GROUP_BILL_LIST}
        component={GroupBillListScreen}
        // options={{headerShown: false}}
      />
      <BillListStack.Screen
        name={RouteNames.BILL_MANAGEMENT}
        component={BillListScreen}
        options={{headerShown: true}}
      />
      <BillListStack.Screen
        name={RouteNames.BILL}
        component={BillScreen}
        options={{headerShown: true}}
      />
      <BillListStack.Screen
        name={RouteNames.BILL_INFO}
        component={BillInfoScreen}
      />
    </BillListStack.Navigator>
  );
};

const TodosTopTabNavigator = createMaterialTopTabNavigator();

const TodosTabs = () => {
  const navigation = useNavigation();
  return (
    <TodosTopTabNavigator.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.text.orange,
        },
      }}>
      <TodosTopTabNavigator.Screen
        name={RouteNames.PRIVATE_TODOS_TAB}
        children={() => {
          return <TodosListScreen navigation={navigation} state={'Private'} />;
        }}
      />
      <TodosTopTabNavigator.Screen
        name={RouteNames.PUBLIC_TODOS_TAB}
        children={() => {
          return <TodosListScreen navigation={navigation} state={'Public'} />;
        }}
      />
      {/* <Tab.Screen  */}
    </TodosTopTabNavigator.Navigator>
  );
};

const TodosListStack = createNativeStackNavigator();
const TodosListScreenStack = () => {
  return (
    <TodosListStack.Navigator initialRouteName={RouteNames.TODOS_TAB}>
      <TodosListStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />
      <TodosListStack.Screen
        name={RouteNames.CREATE_TODOS}
        component={CreateTodosScreen}
        // options={{headerShown: false}}
      />
      <TodosListStack.Screen
        name={RouteNames.GROUP_TODOS_LIST}
        component={GroupTodosListScreen}
        // options={{headerShown: false}}
      />
      <TodosListStack.Screen
        name={RouteNames.TODOS_TAB}
        component={TodosTabs}
        initialParams={{screen: RouteNames.PRIVATE_TODOS_TAB}}
        // options={{headerShown: false}}
      />
      <TodosListStack.Screen
        name={RouteNames.TODOS}
        component={TodosScreen}
        // options={{headerShown: false}}
      />
    </TodosListStack.Navigator>
  );
};

const TaskListStack = createNativeStackNavigator();
const TaskListScreenStack = () => {
  return (
    <TaskListStack.Navigator initialRouteName={RouteNames.TASK_LIST}>
      <TaskListStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />
      <TaskListStack.Screen
        name={RouteNames.GROUP_TASK_LIST}
        component={GroupTaskListScreen}
        // options={{headerShown: false}}
      />
      <TaskListStack.Screen
        name={RouteNames.TASK_LIST}
        component={TaskListScreen}
        // options={{headerShown: false}}
      />
      <TaskListStack.Screen
        name={RouteNames.CREATE_TASK}
        component={CreateTaskScreen}
        // options={{headerShown: false}}
      />
      <TaskListStack.Screen
        name={RouteNames.TASK}
        component={TaskDetailScreen}
        // options={{headerShown: false}}
      />
    </TaskListStack.Navigator>
  );
};

const FundListTask = createNativeStackNavigator();
const FundListScreenStack = () => {
  return (
    <FundListTask.Navigator initialRouteName={RouteNames.FUND_LIST}>
      <FundListTask.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
        }}
      />

      <FundListTask.Screen
        name={RouteNames.FUND_LIST}
        component={FundListScreen}
        // options={{headerShown: false}}
      />
      <FundListTask.Screen
        name={RouteNames.CREATE_FUND}
        component={CreateFundScreen}
        // options={{headerShown: false}}
      />
      <FundListTask.Screen
        name={RouteNames.FUND}
        component={FundDetailScreen}
        // options={{headerShown: false}}
      />
    </FundListTask.Navigator>
  );
};

const HomeStack = createNativeStackNavigator();
const HomeScreenStack = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <HomeStack.Navigator initialRouteName={RouteNames.HOME}>
      <HomeStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          title: 'Nhóm chat',
          headerShown: false,
        }}
      />
      <HomeStack.Screen name={RouteNames.HOME} component={HomeScreen} />
      <HomeStack.Screen
        name={RouteNames.BILL_LIST_STACK}
        component={BillListScreenStack}
        options={{
          title: 'Quản lý nợ',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.TODOS_LIST_STACK}
        component={TodosListScreenStack}
        options={{
          title: 'Quản lý việc cần làm',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.TASK_LIST_STACK}
        component={TaskListScreenStack}
        options={{
          title: 'Lịch biểu',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.FUND_LIST_STACK}
        component={FundListScreenStack}
        options={{
          title: 'Quản lý quỹ',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={RouteNames.BANK_INTEREST_RATE}
        component={InterestRateScreen}
        options={{
          headerShown: true,
          headerRight: () => {
            return (
              // <TouchableOpacity>
              //   <Ionicons
              //     name="information-circle-outline"
              //     size={24}
              //     color={'black'}
              //   />
              // </TouchableOpacity>
              <ToolTip
                content="So sánh sự chênh lệch tiền lãi nếu rút khoản tiết kiệm trước kỳ hạn và gửi lại với lãi suất mới"
                isTooltipVisible={isTooltipVisible}
                setIsTooltipVisible={setIsTooltipVisible}
              />
            );
          },
        }}
      />
    </HomeStack.Navigator>
  );
};

const PackageStack = createNativeStackNavigator();
const PackageScreenStack = ({navigation}: {navigation: any}) => {
  return (
    <PackageStack.Navigator initialRouteName={RouteNames.PACKAGE}>
      <PackageStack.Screen
        name={RouteNames.PACKAGE}
        component={PackageScreen}
        options={{
          headerRight: ({tintColor}) => {
            return appStore.isLoggedIn ? (
              <TouchableOpacity
                onPress={() => {
                  console.log('Cart');
                  navigation.navigate(RouteNames.CART as never, {} as never);
                }}>
                {/* <Icon name="shoppingcart" size={22} color={tintColor} /> */}
                <Ionicons name="cart-outline" size={24} color={tintColor} />
              </TouchableOpacity>
            ) : null;
          },
        }}
      />
      <PackageStack.Screen name={RouteNames.CART} component={CartScreen} />
      <PackageStack.Screen
        name={RouteNames.PAYMENT}
        component={PaymentScreen}
      />
      <PackageStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          headerShown: false,
          title: 'Nhóm chat',
        }}
      />
    </PackageStack.Navigator>
  );
};

const AddProductStack = createNativeStackNavigator();
const AddProductScreenStack = () => {
  return (
    <AddProductStack.Navigator initialRouteName={RouteNames.STORAGE_GROUPS}>
      <AddProductStack.Screen
        name={appStore.isLoggedIn ? RouteNames.STORAGE_GROUPS : 'Quản lý gói'}
        component={GroupsProductsListScreen}
      />
      <AddProductStack.Screen
        name={RouteNames.ADD_GROUP_PRODUCT}
        component={AddProdInfoScreen}
      />
      <AddProductStack.Screen
        name={RouteNames.ADD_STORAGE_LOCATION}
        component={AddStorageLocationScreen}
      />
      <AddProductStack.Screen
        name={RouteNames.ADD_PURCHASE_LOCATION}
        component={AddPurchaseLocationScreen}
      />
      <AddProductStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          headerShown: false,
          title: 'Nhóm chat',
        }}
      />
    </AddProductStack.Navigator>
  );
};

const StorageTopTabNavigator = createMaterialTopTabNavigator();
const StorageTabs = () => {
  return (
    <StorageTopTabNavigator.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.text.orange,
        },
      }}>
      <StorageTopTabNavigator.Screen
        name={RouteNames.PRODUCTS}
        component={NewGroupProductsScreen}
      />
      <StorageTopTabNavigator.Screen
        name={RouteNames.STORAGE_LOCATIONS}
        component={StorageLocationScreen}
      />
      <StorageTopTabNavigator.Screen
        name={RouteNames.PURCHASE_LOCATIONS}
        component={PurchaseLocationScreen}
      />
      {/* <Tab.Screen  */}
    </StorageTopTabNavigator.Navigator>
  );
};

const StorageStack = createNativeStackNavigator();

const StorageScreenStack = () => {
  return (
    <StorageStack.Navigator initialRouteName={RouteNames.PRODUCTS}>
      {/* <StorageStack.Screen
        name={appStore.isLoggedIn ? RouteNames.STORAGE_GROUPS : 'Quản lý gói'}
        component={GroupsProductsListScreen}
      /> */}
      {/* <StorageStack.Screen
        name={RouteNames.STORAGE_TABS}
        component={StorageTabs}
        options={{
          title: 'Quản lý nhu yếu phẩm',
        }}
      /> */}
      <StorageStack.Screen
        name={RouteNames.PRODUCTS}
        component={NewGroupProductsScreen}
      />
      <StorageStack.Screen
        name={RouteNames.PRODUCT_DETAIL}
        component={ProductDetailScreen}
      />
      <StorageStack.Screen
        name={RouteNames.ADD_PRODUCT_INFO}
        component={AddProdInfoScreen}
      />
      <StorageStack.Screen
        name={RouteNames.ADD_GROUP_PRODUCT}
        component={AddGroupProductScreen}
      />
      <StorageStack.Screen
        name={RouteNames.ADD_STORAGE_LOCATION}
        component={AddStorageLocationScreen}
      />
      <StorageStack.Screen
        name={RouteNames.STORAGE_LOCATION_DETAIL}
        component={StorageLocationDetailScreen}
      />
      <StorageStack.Screen
        name={RouteNames.EDIT_STORAGE_LOCATION_DETAIL}
        component={EditStorageLocationDetailScreen}
      />
      <StorageStack.Screen
        name={RouteNames.ADD_PURCHASE_LOCATION}
        component={AddPurchaseLocationScreen}
      />
      <StorageStack.Screen
        name={RouteNames.SCAN_BARCODE}
        component={ScanBarcodeScreen}
      />
      <StorageStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          headerShown: false,
          title: 'Nhóm chat',
        }}
      />
      <StorageStack.Screen
        name={RouteNames.ADD_NEW_GROUP_PRODUCT}
        component={AddNewGroupProductScreen}
      />
    </StorageStack.Navigator>
  );
};

const GroupsTopTabNavigator = createMaterialTopTabNavigator();

const GroupTabs = () => {
  return (
    <GroupsTopTabNavigator.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.text.orange,
        },
      }}>
      <GroupsTopTabNavigator.Screen
        name={RouteNames.CURRENT_PACKAGE}
        component={CurrentPackage}
      />
      <GroupsTopTabNavigator.Screen
        name={RouteNames.OTHER_PACKAGES}
        component={OtherPackages}
      />
      {/* <Tab.Screen  */}
    </GroupsTopTabNavigator.Navigator>
  );
};

const ProfileTopTabNavigator = createMaterialTopTabNavigator();

const UserInfoTabs = () => {
  return (
    <ProfileTopTabNavigator.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.text.orange,
        },
      }}>
      <ProfileTopTabNavigator.Screen
        name={RouteNames.PROFILE}
        component={ProfileScreen}
      />
      <ProfileTopTabNavigator.Screen
        name={RouteNames.GROUPS}
        component={GroupsScreen}
      />
      {/* <Tab.Screen  */}
    </ProfileTopTabNavigator.Navigator>
  );
};

const ProfileStack = createNativeStackNavigator();
function ProfileScreenStack() {
  return (
    <ProfileStack.Navigator initialRouteName={RouteNames.PROFILE_TABS}>
      <ProfileStack.Screen
        name={RouteNames.PROFILE_TABS}
        component={UserInfoTabs}
        initialParams={{screen: RouteNames.PROFILE}}
        options={{
          title: 'Trang cá nhân',
        }}
      />
      <ProfileStack.Screen
        name={RouteNames.GROUP_TABS}
        component={GroupTabs}
        initialParams={{screen: RouteNames.CURRENT_PACKAGE}}
        options={{
          title: 'Thông tin chi tiết nhóm',
        }}
      />
      {/* <ProfileStack.Screen
        name={RouteNames.PROFILE}
        component={UserInfoScreen}
      /> */}
      <ProfileStack.Screen
        name={RouteNames.EDIT_PROFILE}
        component={EditProfileScreen}
      />
      <ProfileStack.Screen
        name={RouteNames.EDIT_GROUP_INFO}
        component={EditGroupInfoScreen}
      />
      <ProfileStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          headerShown: false,
          title: 'Nhóm chat',
        }}
      />
    </ProfileStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();
function SettingsScreenStack() {
  return (
    <SettingsStack.Navigator initialRouteName={RouteNames.SETTINGS}>
      <SettingsStack.Screen
        name={RouteNames.SETTINGS}
        component={SettingsScreen}
      />
      <SettingsStack.Screen
        name={RouteNames.APP_INFO}
        component={AppInfoScreen}
      />
      <SettingsStack.Screen
        name={RouteNames.POLICIES_RIGHTS}
        component={PoliciesScreen}
      />
      <SettingsStack.Screen
        name={RouteNames.CHAT_STACK}
        component={ChatScreenStack}
        options={{
          headerShown: false,
          title: 'Nhóm chat',
        }}
      />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default observer(function BottomNavigationBar() {
  return (
    <Tab.Navigator
      backBehavior="none"
      initialRouteName={RouteNames.HOME_STACK_BOTTOM}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {paddingBottom: 5},
        tabBarActiveTintColor: Colors.bottomTabActiveIcon,
        tabBarInactiveTintColor: Colors.bottomTabInactiveIcon,
        tabBarStyle: {
          height: 60,
          backgroundColor: Colors.bottomTabBackground,
        },
      }}>
      <Tab.Screen
        name={RouteNames.PACKAGE_STACK_BOTTOM}
        component={PackageScreenStack}
        initialParams={{screen: RouteNames.PACKAGE}}
        options={{
          unmountOnBlur: true,
          title: 'Gói',
          tabBarIcon: ({color}) => {
            return <Icon name="addusergroup" size={22} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.STORAGE_STACK_BOTTOM}
        component={StorageScreenStack}
        initialParams={{screen: RouteNames.ADD_NEW_GROUP_PRODUCT}}
        options={{
          unmountOnBlur: true,
          title: 'Quản lý NYP',
          tabBarIcon: ({color}) => {
            return <Icon name="isv" size={20} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.HOME_STACK_BOTTOM}
        component={HomeScreenStack}
        initialParams={{screen: RouteNames.HOME}}
        options={{
          unmountOnBlur: true,
          title: 'Trang chủ',
          tabBarIcon: ({color}) => {
            return <Icon name="home" size={20} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.PROFILE_STACK}
        component={ProfileScreenStack}
        initialParams={{screen: RouteNames.PROFILE_TABS}}
        // listeners={({navigation}) => ({
        //   tabPress: () => {
        //     if (appStore.isLoggedIn === false) {
        //       console.log(appStore.isLoggedIn);

        //       navigation.navigate(RouteNames.LOGIN);
        //     }
        //   },
        // })}
        options={{
          unmountOnBlur: true,
          title: 'Tôi',
          tabBarIcon: ({color}) => {
            return <Icon name="user" size={20} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.SETTINGS_STACK_BOTTOM}
        component={SettingsScreenStack}
        initialParams={{screen: RouteNames.SETTINGS}}
        options={{
          unmountOnBlur: true,
          title: 'Cài đặt',
          tabBarIcon: ({color}) => {
            return <Icon name="setting" size={20} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
});
