import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: '100%',
  },
  loginTextContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  loginText: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.text.grey,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: width,
    minHeight: '100%',
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: width,
    marginBottom: 20,
    position: 'absolute',
    top: 0,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: width / 2,
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
