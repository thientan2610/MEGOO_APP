import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const fontScale = Dimensions.get('window').fontScale;

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
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text.grey,
  },
  container: {
    width: width,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 18,
    color: Colors.text.orange,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  locationsContainer: {
    width: width,
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  locationContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: Colors.background.white,
    borderRadius: 10,
  },
  locationImg: {
    width: '30%',
    height: '100%',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    // borderRadius: 70 / 2,
  },
  locationInfoContainer: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 10,
  },
  locationInfoRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 14,
    color: Colors.text.grey,
    textAlign: 'justify',
  },
  infoText: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'justify',
  },
});

export default styles;
