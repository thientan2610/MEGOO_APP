import axios from 'axios';
import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown, SelectCountry} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {Colors} from '../../../constants/color.const';
import {URL_HOST} from '../../../core/config/api/api.config';
import {getUserGroup} from '../../../services/group.service';
import {IMAGE_URI_DEFAULT} from '../../default';
import appStore from '../../store/app.store';
import groupStore from '../../store/group.store';

interface ISelectCountryItem {
  label: string;
  value: string;
  image: {
    uri: string;
  };
}

interface IProps {
  navigation: any;
}

const GroupsDropdownPicker = () => {
  const [value, setValue] = useState('');
  const [items, setItems] = useState<ISelectCountryItem[]>([]);

  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    if (appStore.isLoggedIn === true) {
      // Get all user's groups
      const groupsRes = await getUserGroup();
      if (
        !groupsRes.groups ||
        !groupsRes?.groups?.length ||
        groupsRes?.groups?.length === 0
      ) {
        return [];
      } else {
        const activeGroups = groupsRes.groups.filter((groupItem: any) =>
          groupItem.packages.some((pkg: any) => pkg.status === 'Active'),
        );

        if (
          !activeGroups ||
          !activeGroups.length ||
          activeGroups.length === 0
        ) {
          return;
        }

        const myItems = activeGroups.map((groupItem: any) => {
          const item: ISelectCountryItem = {
            label: groupItem.name,
            value: groupItem._id,
            image: {
              uri: groupItem?.avatar || IMAGE_URI_DEFAULT,
            },
          };

          return item;
        });

        setItems(myItems);
      }
    }
  };

  // watch groupStore.activeGroups on changes
  useEffect(() => {
    if (groupStore.toUpdateGroupDropdown) {
      getGroups();
      groupStore.setToUpdateGroupDropdown(false);
    }
  }, [groupStore.toUpdateGroupDropdown]);

  useEffect(() => {
    console.log('render dropdown:', items.length);

    if (groupStore.id === '' && items.length > 0) {
      setValue(items[0].value);
      groupStore.setGroupId(items[0].value);
    }
  }, [items]);

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
          Nhóm:
        </Text>
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
        placeholder={!isFocus ? 'Chọn nhóm' : '...'}
        searchPlaceholder="Tìm kiếm ..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);

          groupStore.setGroupId(item.value);

          console.log('gp selected: ', JSON.stringify(item, null, 2));
        }}
      />
    </View>
  );
};

export default observer(GroupsDropdownPicker);
