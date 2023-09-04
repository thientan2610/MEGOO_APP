import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import styles from '../../screens/AddGroupProductScreen/styles/style';
import * as sl from '../../services/storage-location.service';

interface IProps {
  navigation?: any;
  groupId: string;
  fnUpdateStorageLocationId: (id: string) => void;
}
const StorageLocationDropdownPicker: React.FC<IProps> = ({
  navigation,
  groupId,
  fnUpdateStorageLocationId,
}) => {
  const [value, setValue] = useState('');
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    search('');
  }, []);

  const search = async (text: string) => {
    // Get items from API
    const resp = await sl.getStorageLocationPaginated({
      groupId: groupId,
      searchBy: ['name'],
      search: text,
      limit: 100,
      filter: {
        'timestamp.deletedAt': '$eq:$null',
      },
      sortBy: ['name:ASC', 'timestamp.createdAt:ASC'],
    });

    // Set items for the dropdown
    const items = resp.data
      .map(item => ({
        label: item.name || '',
        value: item.id || '',
      }))
      .filter(item => item.label !== '');

    setItems(items);
  };

  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'flex-end',
        backgroundColor: Colors.background.white,
        borderRadius: 10,
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: 10,
        }}>
        <Text
          style={{
            width: '90%',
            textAlign: 'left',
            color: Colors.title.orange,
            fontWeight: 'bold',
            fontSize: 16,
            marginBottom: 10,
          }}>
          Vị trí lưu trữ
        </Text>
        {navigation && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(RouteNames.ADD_STORAGE_LOCATION, {})
            }>
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={Colors.text.orange}
            />
          </TouchableOpacity>
        )}
      </View>

      <Dropdown
        containerStyle={{
          width: '100%',
        }}
        placeholderStyle={{
          color: Colors.text.lightgrey,
          fontSize: 14,
        }}
        itemTextStyle={{
          color: Colors.text.grey,
          fontSize: 14,
        }}
        data={items}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Chọn vị trí lưu trữ ...' : '...'}
        searchPlaceholder="Tìm kiếm ..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);

          fnUpdateStorageLocationId(item.value);
        }}
      />
    </View>
  );
};

export default observer(StorageLocationDropdownPicker);
