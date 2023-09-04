import {Dimensions, StyleSheet} from 'react-native';

import {Colors} from '../../../../../constants/color.const';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: width,
    minHeight: '100%',
    marginTop: 20,
    paddingBottom: 20,
    // justifyContent: 'center',
  },
  titleContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  title: {
    textAlign: 'left',
    fontSize: 18,
    color: Colors.title.orange,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    color: Colors.text.grey,
  },
  packageContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    gap: 10,
  },
  packageContent: {
    width: '100%',
    display: 'flex',
    gap: 20,
  },
  packageInfo: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
});

export default styles;
