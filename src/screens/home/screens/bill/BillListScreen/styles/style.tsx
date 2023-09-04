import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../../constants/color.const';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
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
    // backgroundColor: 'pink',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
  billListContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  billItemContainer: {
    width: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: Colors.background.white,
    borderRadius: 10,
  },
  infoRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  headingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.grey,
  },
  infoText: {
    width: '100%',
    fontSize: 14,
    color: Colors.text.lightgrey,
  },
});

export default styles;
