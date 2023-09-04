import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

import {Colors} from '../../../../../constants/color.const';
import {IDistrict} from '../../../interfaces/base-dto/district.interfaces';
import * as ds from '../../../services/divisions.service';

interface IProps {
  pCode?: number;
  fnUpdateDistrict: Function;
  disabled?: boolean;
}
const GroupProductDropdownPicker: React.FC<IProps> = ({
  disabled,
  pCode,
  fnUpdateDistrict,
}) => {
  const [value, setValue] = useState('');
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [itemsFullData, setItemsFullData] = useState<IDistrict[]>([]);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    search('');
  }, []);

  const search = async (text: string) => {
    // Show the loading animation

    if (!pCode) {
      setItems([]);
      setItemsFullData([]);
      return;
    }

    // Get items from API
    const resp: IDistrict[] = await ds.searchDistricts({
      q: text,
      p: pCode,
    });

    // Set items for the dropdown
    const items = resp
      .map(item => ({
        label: item.name || '',
        value: item.code.toString() || '',
      }))
      .filter(item => item.label !== '');

    setItems(items);

    setItemsFullData(resp);
  };

  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 10,
        marginTop: 10,
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: Colors.text.orange,
          fontSize: 16,
          marginBottom: 10,
        }}>
        Quận/huyện
      </Text>
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
        selectedTextStyle={{
          color: Colors.text.grey,
          fontSize: 14,
        }}
        data={items}
        search
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Chọn quận huyện ...' : '...'}
        searchPlaceholder="Tìm kiếm ..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
          fnUpdateDistrict(
            itemsFullData.find(i => item?.value && i.code === +item?.value),
          );
        }}
        disable={disabled}
      />
    </View>
  );
};

export default observer(GroupProductDropdownPicker);
