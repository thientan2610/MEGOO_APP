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
    marginVertical: 20,
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  image: {
    width: 200,
    height: 200,
    // borderRadius: 200 / 2,
    borderWidth: 1,
    borderColor: Colors.border.lightgrey,
    borderRadius: 15,
  },
  inputContainer: {
    width: '80%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    borderColor: Colors.border.lightgrey,
    borderBottomWidth: 1,
    // borderRadius: 10,
  },
  infoContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    paddingBottom: 100,
  },
  btnSubmit: {
    width: '100%',
  },
  inputLabel: {
    width: '100%',
    textAlign: 'left',
    color: Colors.title.orange,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  infoInput: {
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -5,
    marginBottom: 5,
    borderColor: Colors.border.lightgrey,
    borderBottomWidth: 1,
  },
  icon: {
    fontWeight: '200',
    color: Colors.icon.lightgrey,
    fontSize: 20,
  },
  button: {
    width: '100%',
    height: 40,
    marginVertical: 20,
    display: 'flex',
    alignSelf: 'flex-end',
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

  dropdownContainer: {
    display: 'flex',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    marginVertical: 10,
    gap: 10,
    zIndex: 999,
  },
  inputIcon: {
    fontWeight: '200',
    color: Colors.icon.lightgrey,
    fontSize: 20,
  },
});

export default styles;
