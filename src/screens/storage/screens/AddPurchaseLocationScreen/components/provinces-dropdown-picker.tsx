import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

import {Colors} from '../../../../../constants/color.const';
import {IProvince} from '../../../interfaces/base-dto/province.interface';
import * as ds from '../../../services/divisions.service';

interface IProps {
  fnUpdateProvince: Function;
}
const ProvincesDropdownPicker: React.FC<IProps> = ({fnUpdateProvince}) => {
  const [value, setValue] = useState('');
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [itemsFullData, setItemsFullData] = useState<IProvince[]>([]);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    search('');
  }, []);

  const search = async (text: string) => {
    // Get items from API
    const resp: IProvince[] = await ds.searchProvinces({
      q: text,
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
        // alignItems: 'flex-end',
        // backgroundColor: Colors.background.white,
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
        Tỉnh/thành phố
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
          console.log(
            'itemsFullData.find(i => item?.value && i.code === +item?.value)',
            JSON.stringify(
              itemsFullData.find(i => item?.value && i.code === +item?.value),
            ),
          );

          fnUpdateProvince(
            itemsFullData.find(i => item?.value && i.code === +item?.value),
          );
        }}
      />
    </View>
  );
};

export default observer(ProvincesDropdownPicker);
