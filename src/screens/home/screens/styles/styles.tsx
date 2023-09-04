import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../constants/color.const';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    display: 'flex',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100%',
    // backgroundColor: 'pink',
  },
  text: {
    fontSize: 16,
    color: Colors.text.grey,
  },
  titleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 20,
  },
  title: {
    // width: '90%',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
  subTitle: {
    fontSize: 14,
    color: Colors.title.orange,
  },
  utilitiesContainer: {
    display: 'flex',
    // flex: 1,
    width: '90%',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  utilitiesContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // gap: 10,
    marginBottom: 20,
    // flexWrap: 'wrap',
    // backgroundColor: 'green',
  },
  utility: {
    minWidth: '100%',
    height: 50,
    // padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    borderColor: Colors.border.orange,
    borderWidth: 1,
    // marginBottom: 20,
  },
  utilityText: {
    fontSize: 14,
    color: Colors.text.orange,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carouselItemContainer: {
    width: width * 0.7,
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  carouselItem: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
  },
  infoRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 5,
  },
  pkgTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.orange,
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    // backgroundColor: 'yellow',
    gap: 10,
    // marginHorizontal: 15,
  },
  button: {
    width: 110,
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',

    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border.orange,
    padding: 5,
  },
  buttonText: {
    fontSize: 12,
    color: Colors.buttonText.orange,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;
