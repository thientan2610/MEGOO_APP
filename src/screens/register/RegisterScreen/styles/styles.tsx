import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../constants/color.const';

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100%',
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.text.orange,
  },
  dividerContainer: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textDivider: {textAlignVertical: 'center', color: 'grey'},
  divider: {
    marginVertical: 20,
    width: '40%',
    borderBottomColor: Colors.border.lightgrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  input: {
    width: '80%',
    padding: 10,
    margin: 15,
    backgroundColor: Colors.background.white,
    borderColor: Colors.border.lightgrey,
    borderWidth: 1,
    borderRadius: 10,
  },
  button: {
    width: '80%',
    content: 'fill',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    margin: 10,
    padding: 8,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.buttonText.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialButton: {
    width: '80%',
    content: 'fill',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginVertical: 10,
    padding: 10,
    paddingLeft: 20,
    backgroundColor: Colors.buttonBackground.white,
    borderColor: Colors.border.lightgrey,
    borderWidth: 1,
    borderRadius: 10,

    image: {
      width: 30,
      height: 30,
    },
  },
  text: {
    fontSize: 16,
    color: Colors.text.grey,
  },
  flexRow: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textPrimary: {
    fontSize: 14,
    color: Colors.text.orange,
    marginVertical: 10,
  },
  loginPrimary: {
    marginLeft: 10,
    fontWeight: 'bold',
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
  inputIcon: {
    fontWeight: '200',
    color: Colors.icon.lightgrey,
    fontSize: 20,
  },
  inputText: {flex: 1, color: Colors.text.grey},
  error: {
    width: '80%',
    color: Colors.text.red,
    textAlign: 'left',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '30%',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 150,
  },
  buttonModal: {
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtonModal: {color: Colors.text.grey, fontSize: 16, fontWeight: 'bold'},
});

export default styles;
