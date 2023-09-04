import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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
    flex: 1,
    alignItems: 'center',
    minHeight: height,
    marginVertical: 20,
  },
  titleContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    textAlign: 'left',
    fontSize: 18,
    color: Colors.title.orange,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 12,
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    color: Colors.title.orange,
  },
  text: {
    color: Colors.text.grey,
    fontSize: 14,
  },
  groupContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    gap: 10,
  },
  groupInfo: {
    display: 'flex',
    width: '100%',
    gap: 10,
    // marginVertical: 10,
  },
  groupAvatar: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    // marginHorizontal: 10,
  },
  infoRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
});

export default styles;
