import {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import userStore from '../../../../common/store/user.store';
import styles from './styles/style';

const ChangeAvatarScreen = () => {
  const [selectedImages, setSelectedImages] = useState('');

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Image
        source={{
          uri:
            selectedImages != ''
              ? selectedImages
              : userStore?.avatar || IMAGE_URI_DEFAULT,
        }}
        style={{
          width: 200,
          height: 200,
          // borderRadius: 200 / 2,
          marginTop: 20,
        }}
      />

      <TouchableOpacity
        style={{marginVertical: 10}}
        onPress={() => {
          console.log('Change avatar');
          launchImageLibrary(
            {mediaType: 'mixed', includeBase64: true},
            response => {
              // console.log('Response = ', response);

              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
              } else {
                let source: Asset[] = response.assets as Asset[];
                // console.log('base64string:', source[0].base64);
                // console.log('source:', source[0].uri);
                setSelectedImages(`${source[0].uri}`);
              }
            },
          );
        }}>
        <Text>Chọn hình</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // onPress={() => {
        //   navigation.navigate(RouteNames.PROFILE as never, {} as never);
        // }}
        style={[styles.button, {marginTop: 50}]}>
        <Text style={styles.buttonText}>Lưu thông tin</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangeAvatarScreen;
