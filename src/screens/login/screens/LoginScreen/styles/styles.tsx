import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../constants/color.const';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.white,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.orange,
  },
  dividerContainer: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dividerText: {textAlignVertical: 'center', color: Colors.border.lightgrey},
  divider: {
    marginVertical: 20,
    width: '40%',
    borderBottomColor: Colors.border.lightgrey,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 1,
  },
  input: {
    width: '80%',
    padding: 10,
    margin: 15,
    backgroundColor: 'white',
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
    fontSize: 14,
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
  registerPrimary: {
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
    borderColor: Colors.secondary,
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
});

export default styles;
