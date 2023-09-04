import {Formik} from 'formik';
import {observer} from 'mobx-react';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Button, TextInput, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Colors} from '../../../constants/color.const';
import appStore from '../../store/app.store';
import searchStore from '../../store/search.store';
import {styles} from './styles';

const SearchComp = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<TextInput>(null);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    console.log(`${new Date()} text: `, text);

    // searchStore.setSearchText(inputValue);
  };

  // listen to change of `searchText` in `searchStore`
  useEffect(() => {
    setInputValue(searchStore.searchText);
  }, [searchStore.searchText]);

  const onPress = () => {
    if (inputRef.current) {
      inputRef.current.blur(); // Blurs the input when the button is clicked
    }

    console.log('Search button pressed, change `isPerformingSearch` to true');
    searchStore.setSearchText(inputValue);
    searchStore.setIsPerformingSearch(true);
  };

  return appStore.searchActive ? (
    <Fragment>
      <TextInput
        ref={inputRef}
        value={inputValue}
        onChangeText={handleInputChange}
        onSubmitEditing={onPress}
        placeholder="Tìm kiếm ..."
        placeholderTextColor={Colors.text.lightgrey}
        style={styles.textInput}
      />
      <TouchableOpacity onPress={onPress}>
        <Ionicons name="search-outline" size={24} color={'black'} />
      </TouchableOpacity>
    </Fragment>
  ) : null;
};

export default observer(SearchComp);
