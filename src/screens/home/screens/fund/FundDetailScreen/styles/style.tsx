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
  modalContentContainer: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: 10,
    gap: 10,
    padding: 20,
  },
  modalTextContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: 'left',
    color: Colors.text.grey,
  },
  deleteButton: {
    width: '90%',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.red,
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
