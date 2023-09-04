import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: width,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 18,
    color: Colors.title.orange,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  locationContainer: {
    width: width,
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  locationItem: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: Colors.background.white,
    borderRadius: 10,
  },
  locationImg: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  locationInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  locationInfoRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  text: {
    fontSize: 14,
    color: Colors.text.grey,
    textAlign: 'justify',
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.lightgrey,
    textAlign: 'justify',
  },
});

export default styles;
