import {StyleSheet} from 'react-native';

import {Colors} from '../../../../../constants/color.const';

const styles = StyleSheet.create({
  button: {
    width: '90%',
    content: 'fill',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    margin: 10,
    padding: 8,
    backgroundColor: Colors.buttonBackground.orange,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
