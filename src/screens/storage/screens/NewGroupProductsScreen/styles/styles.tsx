import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: width,
    display: 'flex',
    alignItems: 'center',
  },
  contentContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    width: '80%',
    textAlign: 'left',
    fontSize: 18,
    color: Colors.title.orange,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  productItemContainer: {
    position: 'relative',
    width: '90%',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 15,
    // justifyContent: 'center',
    // padding: 10,
    borderColor: 'transparent', // Add this to remove default highlight effect
  },
  selectedItemHighlight: {
    // ... Your existing styles for the selectedItemHighlight
    borderColor: '#FFA500',
    borderWidth: 2,
    borderRadius: 5,
    zIndex: 3,
  },
  productInfoContainer: {
    width: '70%',
    display: 'flex',
    gap: 10,
    padding: 10,
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  prodImg: {
    width: '30%',
    height: '100%',
    // borderRadius: 70 / 2,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  prodTag: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderColor: Colors.border.lightgrey,
    borderWidth: 1,
    backgroundColor: Colors.background.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 100,
    zIndex: 2,
  },
  prodTagText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.grey,
    letterSpacing: 1.2,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  prodTagRunningOutOfStock: {
    borderColor: Colors.border.orange,
  },
  prodTagTextRunningOutOfStock: {
    color: Colors.text.orange,
  },
  prodTagOutOfStock: {
    borderColor: Colors.border.red,
  },
  prodTagTextOutOfStock: {
    color: Colors.text.red,
  },
  text: {
    fontSize: 14,
    color: Colors.text.lightgrey,
    textAlign: 'justify',
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.grey,
    textAlign: 'justify',
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 14,
    color: Colors.text.grey,
    textAlign: 'justify',
    fontStyle: 'italic',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentContainer: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
  },
  modalTitleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  modalTitle: {
    width: '70%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
  modalOptionsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    // backgroundColor: 'pink',
  },
  modalOption: {
    width: '45%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border.orange,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  barcodeTextURL: {
    fontSize: 20,
    color: Colors.text.grey,
    fontWeight: 'bold',
    // backgroundColor: 'red',
  },
});

export default styles;
