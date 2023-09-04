import {Formik} from 'formik';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import Modal from 'react-native-modal/dist/modal';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';

import AddImageModal from '../../../../common/components/AddImageModal';
import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import appStore from '../../../../common/store/app.store';
import groupStore from '../../../../common/store/group.store';
import userStore from '../../../../common/store/user.store';
import {Colors} from '../../../../constants/color.const';
import {ICreateStorageLocationReq} from '../../interfaces/storage-locations';
import {createStorageLocation} from '../../services/storage-location.service';
import styles from './styles/style';

const AddProdInfoScreen = ({navigation}: {navigation: any}) => {
  const initialValues = {
    storageName: '',
    description: '',
  };

  const [selectedImage, setSelectedImage] = useState<string>(IMAGE_URI_DEFAULT);
  const [imageFile, setImageFile] = useState<any>();
  const [modalState, setModalState] = useState(false);

  useEffect(() => {
    appStore.setSearchActive(false);
  }, []);

  useEffect(() => {
    console.log('modalState:', modalState);
  }, [modalState]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      nestedScrollEnabled={true}>
      <KeyboardAvoidingView style={styles.contentContainer}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={async () => {
            setModalState(true);
          }}>
          <Image
            source={{
              uri: selectedImage,
            }}
            style={styles.image}
          />

          <View
            style={{
              display: 'flex',
              position: 'absolute',
              right: 10,
              bottom: 0,
            }}>
            <Icon name="camera" size={40} color={Colors.icon.lightgrey} />
          </View>
        </TouchableOpacity>
        <Formik
          initialValues={initialValues}
          onSubmit={values => {
            console.log('values:', values);

            if (!values.storageName) {
              Toast.show({
                type: 'error',
                text1: 'Vui lòng nhập tên nơi lưu trữ',
                visibilityTime: 1000,
                autoHide: true,
              });
              return;
            }

            const reqDto: ICreateStorageLocationReq = {
              addedBy: userStore.id,
              description: values.description,
              image: imageFile !== IMAGE_URI_DEFAULT ? imageFile : undefined,
              name: values.storageName,
              groupId: groupStore.id,
            };

            createStorageLocation(reqDto)
              .then(res => {
                console.log('res:', JSON.stringify(res, null, 2));

                if (res.statusCode.toString().startsWith('2')) {
                  Toast.show({
                    type: 'success',
                    text1: 'Thêm nơi lưu trữ thành công',
                    visibilityTime: 1000,
                    autoHide: true,
                    onHide: () => {
                      navigation.goBack();
                    },
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: 'Thêm nơi lưu trữ thất bại',
                    visibilityTime: 1000,
                    autoHide: true,
                  });
                }
              })
              .catch(err => {
                console.log('err:', err);

                Toast.show({
                  type: 'error',
                  text1: 'Thêm nơi lưu trữ thất bại',
                  visibilityTime: 1000,
                  autoHide: true,
                });
              });
          }}>
          {({
            values,
            errors,
            touched,
            handleSubmit,
            setFieldTouched,
            setFieldValue,
          }) => (
            <View style={styles.infoContainer}>
              <Text
                style={{
                  width: '100%',
                  textAlign: 'left',
                  color: Colors.title.orange,
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginTop: 10,
                }}>
                Vị trí lưu trữ
              </Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('storageName', value);
                  }}
                  onBlur={() => setFieldTouched('storageName')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Vị trí lưu trữ'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.storageName}
                />

                {values.storageName && (
                  <Icon
                    onPress={() => setFieldValue('storageName', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>
              {errors.storageName && touched.storageName && (
                <Text
                  style={{
                    width: '90%',
                    color: Colors.text.red,
                    textAlign: 'left',
                  }}>
                  {errors.storageName}
                </Text>
              )}

              <Text
                style={{
                  width: '100%',
                  textAlign: 'left',
                  color: Colors.title.orange,
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginTop: 10,
                }}>
                Mô tả
              </Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('description', value);
                  }}
                  onBlur={() => setFieldTouched('description')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Mô tả'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.description}
                />

                {values.description && (
                  <Icon
                    onPress={() => setFieldValue('description', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>
              {errors.description && touched.description && (
                <Text
                  style={{
                    width: '90%',
                    color: Colors.text.red,
                    textAlign: 'left',
                  }}>
                  {errors.description}
                </Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <AddImageModal
          key="addImageModal"
          title={'Chọn ảnh'}
          isModalOpen={modalState}
          setIsModalOpen={setModalState}
          fnUpdateSelectedImage={setSelectedImage}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AddProdInfoScreen;
