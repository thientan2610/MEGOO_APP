import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../../constants/color.const';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: Colors.background.white,
    width: width,
    minHeight: height,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.title.orange,
    lineHeight: 21,
    paddingVertical: 0,
    // marginBottom: 5,
  },
  contentContainer: {
    width: '90%',
    zIndex: 100000,
    display: 'flex',
    gap: 20,
    // backgroundColor: 'yellow',
    marginBottom: 20,
    marginTop: 10,
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
  inputText: {flex: 1, color: Colors.text.grey},
  inputIcon: {
    fontWeight: '200',
    color: Colors.icon.lightgrey,
    fontSize: 20,
  },
  labelText: {
    fontSize: 14,
    color: Colors.text.grey,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',

    color: Colors.text.grey,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.buttonText.white,
  },
  lenderContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  borrowerContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  infoContainer: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 10,
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  avatar: {
    width: Dimensions.get('window').height * 0.07,
    height: Dimensions.get('window').height * 0.07,
    borderRadius: (Dimensions.get('window').height * 0.07) / 2,
  },
  deleteButton: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Colors.buttonBackground.red,
    borderRadius: 10,
    padding: 10,
    // marginTop: 10,
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    width: '100%',
    fontSize: 18,
    color: Colors.text.grey,
    textAlign: 'left',
  },
  modalButtonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
  },
});

export default styles;
