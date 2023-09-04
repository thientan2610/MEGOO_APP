import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown, SelectCountry} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {IItem} from '../../interfaces/base-dto/item.interface';
import * as gp from '../../services/group-products.service';

interface IProps {
  navigation?: any;
  groupId: string;
  fnUpdateGroupProductId: (id: string) => void;
  fnUpdateGpImage: Function;
  initItemId?: string;
}
const GroupProductDropdownPicker: React.FC<IProps> = ({
  navigation,
  groupId,
  fnUpdateGroupProductId,
  fnUpdateGpImage,
  initItemId,
}) => {
  const [value, setValue] = useState('');
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const [itemsFullData, setItemsFullData] = useState<IItem[]>([]);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    search('');
  }, []);

  const search = async (text: string) => {
    // Get items from API
    const resp = await gp.getGroupProductPaginated({
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
        image: {
          uri: item.image || IMAGE_URI_DEFAULT,
        },
      }))
      .filter(item => item.label !== '')
      .filter(item => item.value !== '');

    setItems(items);

    if (initItemId) {
      const selectedItem = items.find(item => item.value === initItemId);
      if (selectedItem) {
        setValue(selectedItem.value);

        initItemId = undefined;

        fnUpdateGpImage(selectedItem?.image?.uri || IMAGE_URI_DEFAULT);

        fnUpdateGroupProductId(selectedItem.value);
      }
    }

    setItemsFullData(resp.data);
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
        marginTop: 10,
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
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
          Nhu yếu phẩm
        </Text>

        {/* if navigation provided - show the add button */}
        {navigation && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(RouteNames.ADD_GROUP_PRODUCT, {})
            }>
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={Colors.text.orange}
            />
          </TouchableOpacity>
        )}
      </View>

      <SelectCountry
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
        selectedTextStyle={{
          color: Colors.text.grey,
          fontSize: 14,
          overflow: 'visible',
        }}
        imageStyle={{
          width: 40,
          height: 40,
          borderRadius: 12,
        }}
        data={items}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        imageField="image"
        placeholder={!isFocus ? 'Chọn loại nhu yếu phẩm' : '...'}
        searchPlaceholder="Tìm kiếm ..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);

          console.log('gp selected: ', JSON.stringify(item, null, 2));

          console.log(
            'new image: ',
            JSON.stringify(
              itemsFullData.find(i => i.id === item.value),
              null,
              2,
            ),
          );
          fnUpdateGpImage(
            itemsFullData.find(i => i.id === item.value)?.image ||
              IMAGE_URI_DEFAULT,
          );

          fnUpdateGroupProductId(item.value);
        }}
        onChangeText={text => search(text)}
      />
    </View>
  );
};

export default observer(GroupProductDropdownPicker);
