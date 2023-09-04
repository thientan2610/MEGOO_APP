import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const fontScale = Dimensions.get('window').fontScale;

const styles = StyleSheet.create({
  container: {
    width: width,
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
  },
  contentContainer: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
    // backgroundColor: 'pink',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 15,
    borderColor: Colors.border.lightgrey,
    borderWidth: 1,
  },
  infoContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  infoInput: {
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    marginBottom: 10,
    borderColor: Colors.border.lightgrey,
    borderBottomWidth: 1,
    // borderRadius: 10,
  },
  icon: {
    fontWeight: '200',
    color: Colors.icon.lightgrey,
    fontSize: 20,
  },
  button: {
    width: '100%',
    height: 50,
    marginVertical: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.buttonBackground.orange,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.buttonText.white,
    fontSize: 18,
    fontWeight: 'bold',
  },

  // View > dropdown
  dropdownContainer: {
    display: 'flex',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    marginVertical: 10,
    gap: 10,
    zIndex: 999,
  },
});

export default styles;
