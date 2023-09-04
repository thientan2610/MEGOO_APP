import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../../constants/color.const';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
    backgroundColor: Colors.background.white,
  },
  titleContainer: {
    width: '90%',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.title.orange,
    lineHeight: 21,
    paddingVertical: 0,
    marginTop: 10,
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
  text: {
    fontSize: 14,
    color: Colors.text.grey,
  },
  inputContainer: {
    width: '90%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 15,
    marginBottom: 10,
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
    width: '90%',
    color: Colors.text.red,
    textAlign: 'left',
    marginBottom: 10,
  },
  createButton: {
    width: '90%',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.orange,
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonText: {
    color: Colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
