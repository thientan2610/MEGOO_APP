import {observer} from 'mobx-react';
import {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import * as pl from '../../services/purchase-locations.service';

interface IProps {
  navigation?: any;
  groupId: string;
  fnUpdatePurchaseLocationId: (id: string) => void;
}
const PurchaseLocationDropdownPicker: React.FC<IProps> = ({
  navigation,
  groupId,
  fnUpdatePurchaseLocationId,
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
    const resp = await pl.getPurchaseLocationPaginated({
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
          alignItems: 'baseline',
          justifyContent: 'space-between',
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
          Địa điểm mua hàng
        </Text>
        {navigation && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(RouteNames.ADD_PURCHASE_LOCATION, {})
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
        placeholder={!isFocus ? 'Chọn nơi mua sắm ...' : '...'}
        searchPlaceholder="Tìm kiếm ..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);

          fnUpdatePurchaseLocationId(item.value);
        }}
      />
    </View>
  );
};

export default observer(PurchaseLocationDropdownPicker);
