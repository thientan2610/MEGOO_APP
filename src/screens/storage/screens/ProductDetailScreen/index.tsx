import {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

import {RouteProp, useRoute} from '@react-navigation/native';

import appStore from '../../../../common/store/app.store';
import groupStore from '../../../../common/store/group.store';
import styles from './styles/style';

// Define the type for the route params
type GroupDetailRouteParams = {
  groupId: string;
  itemId: string;
};

// Specify the type for the route
type GroupDetailRouteProp = RouteProp<
  Record<string, GroupDetailRouteParams>,
  string
>;

const ProductDetailScreen = () => {
  const route = useRoute<GroupDetailRouteProp>();
  const {itemId} = route.params;
  const groupId = groupStore.id;

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log('groupId: ', groupId);
    console.log('itemId: ', itemId);
  }, []);

  useEffect(() => {
    appStore.setSearchActive(false);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Product detail</Text>
    </View>
  );
};

export default ProductDetailScreen;
