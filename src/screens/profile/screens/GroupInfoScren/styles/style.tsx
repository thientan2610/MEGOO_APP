import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: width,
    minHeight: '100%',
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: width,
    // marginBottom: 20,
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
