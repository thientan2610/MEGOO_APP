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
    justifyContent: 'flex-start',
    width: width,
    minHeight: height,
    marginTop: 20,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    backgroundColor: Colors.background.white,
    // marginBottom: 10,
  },
  titleContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  title: {
    textAlign: 'left',
    fontSize: 18,
    color: Colors.text.orange,
    fontWeight: 'bold',
  },
  editText: {
    fontSize: 14,
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    color: Colors.text.orange,
  },
  infoContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    gap: 20,
    padding: 10,
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    color: Colors.text.grey,
    fontSize: 14,
  },
  text: {
    color: Colors.text.grey,
    fontWeight: 'bold',
    fontSize: 14,
  },
  socialContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },
  connectText: {
    color: Colors.text.grey,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default styles;
