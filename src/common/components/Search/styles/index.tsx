import {StyleSheet} from 'react-native';

import {Colors} from '../../../../constants/color.const';

export const styles = StyleSheet.create({
  textInput: {
    backgroundColor: Colors.background.white,
    textAlign: 'left',
    borderBottomWidth: 1,
    borderColor: Colors.border.lightgrey,
    width: '50%',
    color: Colors.text.black,
  },
});
