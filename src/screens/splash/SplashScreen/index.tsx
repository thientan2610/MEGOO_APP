import {Dimensions, Image, Text, View} from 'react-native';

import {Colors} from '../../../constants/color.const';

const SplashScreen = () => {
  return (
    <View
      style={{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background.white,
      }}>
      <Image
        source={require('../../../../assets/logo.png')}
        style={{
          width: '100%',
          height: 100,
          resizeMode: 'center',
        }}
      />
    </View>
  );
};

export default SplashScreen;
