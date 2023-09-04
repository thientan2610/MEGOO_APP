import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../../../../../constants/color.const';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
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
  fundsContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    //   justifyContent: 'space-between',
    backgroundColor: Colors.background.white,
    padding: 10,
    gap: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  text: {
    color: Colors.text.grey,
    fontSize: 14,
  },
});

export default styles;
