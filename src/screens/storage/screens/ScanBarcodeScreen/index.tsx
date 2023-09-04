import 'react-native-reanimated';

import {useCallback, useEffect} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import groupStore from '../../../../common/store/group.store';
import RouteNames from '../../../../constants/route-names.const';
const ScanBarcodeScreen = ({navigation}: {navigation: any}) => {
  const devices = useCameraDevices();
  const device = devices.back;

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const onBarcodeRead = (event: any) => {
    console.log('Scanned barcode:', event.data);
    // Handle the scanned barcode data here

    groupStore.setBarcode(event.data);

    navigation.goBack();

    setTimeout(() => {
      navigation.navigate(RouteNames.ADD_PRODUCT_INFO);
    }, 100);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        onBarCodeRead={onBarcodeRead}
        barCodeTypes={[RNCamera.Constants.BarCodeType.ean13]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default ScanBarcodeScreen;
