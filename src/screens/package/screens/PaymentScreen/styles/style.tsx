import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: width,
    minHeight: '100%',
  },
  itemsContainer: {
    width: '90%',
    display: 'flex',
    gap: 20,
    paddingBottom: 50,
    marginVertical: 20,
  },
  packageContainer: {
    backgroundColor: Colors.background.white,
    borderRadius: 10,
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  text: {
    fontSize: 14,
    color: Colors.text.grey,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.lightgrey,
  },
  title: {
    width: '90%',
    marginVertical: 10,
    textAlign: 'left',
    fontSize: 18,
    color: Colors.text.orange,
    fontWeight: 'bold',
  },
  radioButtonContainer: {
    width: '90%',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
  paymentContainer: {
    width: '100%',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
  },
  priceText: {
    width: '60%',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.grey,
    textAlign: 'center',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    height: '100%',
    backgroundColor: Colors.buttonBackground.orange,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
