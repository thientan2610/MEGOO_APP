import {observer} from 'mobx-react';
import {useState} from 'react';
import {Dimensions, Image, Text, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import {RouteProp, useRoute} from '@react-navigation/native';

import {Colors} from '../../../../../constants/color.const';
import TodosListScreen from '../TodosListScreen';
import TodosScreen from '../TodosScreen';
import styles from './styles/style';

// Define the type for the route params
type GroupsRouteParams = {
  activeTab: string;
};

// Specify the type for the route
type GroupsRouteProp = RouteProp<Record<string, GroupsRouteParams>, string>;

const TodosTabScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupsRouteProp>();

  const [activeTab, setActiveTab] = useState(
    route.params?.activeTab === 'Private' ? 'Private' : 'Public',
  );

  const renderTabContent = () => {
    if (activeTab === 'Private') {
      return <TodosListScreen navigation={navigation} state={'Private'} />;
    } else {
      return <TodosListScreen navigation={navigation} state={'Public'} />;
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const param = route.params?.activeTab;
  //     setActiveTab(param);
  //     console.log('route from payment screen:', route);
  //     console.log('param from payment screen:', param);
  //   }, []),
  // );

  return (
    <View
      style={
        activeTab === 'Private'
          ? [styles.container, {paddingBottom: 60}]
          : styles.container
      }>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === 'Private'
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.white,
            },
          ]}
          onPress={() => {
            setActiveTab('Private');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'Private'
                    ? Colors.buttonText.white
                    : Colors.buttonText.orange,
              },
            ]}>
            Cá nhân
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === 'Public'
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.white,
            },
          ]}
          onPress={() => {
            setActiveTab('Public');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'Public'
                    ? Colors.buttonText.white
                    : Colors.buttonText.orange,
              },
            ]}>
            Nhóm
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{
          position: 'relative',
          top: 50,
          // minHeight: '100%',
        }}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

export default observer(TodosTabScreen);
