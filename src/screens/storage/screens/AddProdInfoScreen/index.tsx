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
import DatePicker from 'react-native-date-picker';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import appStore from '../../../../common/store/app.store';
import groupStore from '../../../../common/store/group.store';
import userStore from '../../../../common/store/user.store';
import {Colors} from '../../../../constants/color.const';
import GroupProductDropdownPicker from '../../components/GroupProductDropdownPicker';
import PurchaseLocationDropdownPicker from '../../components/PurchaseLocationDropdownPicker';
import StorageLocationDropdownPicker from '../../components/StorageLocationDropdownPicker';
import {ICreateItemReq} from '../../interfaces/items';
import {createItem} from '../../services/items.service';
import styles from './styles/style';

const AddProdInfoScreen = ({navigation}: {navigation: any}) => {
  const initialValues = {
    groupProductId: '',
    storageLocationId: '',
    purchaseLocationId: '',
    bestBefore: '',
    unit: '',
    quantity: '',
  };

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState(IMAGE_URI_DEFAULT);
  const [imageFile, setImageFile] = useState<any>();

  useEffect(() => {
    appStore.setSearchActive(false);
  }, []);

  useEffect(() => {
    if (open) {
      setSelectedDate(new Date());
    }
  }, [open]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      nestedScrollEnabled={true}>
      <KeyboardAvoidingView style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: selectedImage,
            }}
            style={styles.image}
          />
          <TouchableOpacity
            style={{
              display: 'flex',
              position: 'absolute',
              right: 15,
              bottom: 10,
            }}
            onPress={async () => {
              launchCamera(
                {
                  mediaType: 'photo',
                  cameraType: 'back',
                },
                response => {
                  console.log('Response = ', response);

                  if (response.didCancel) {
                    console.log('User cancelled image picker');
                  } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                  } else {
                    let source: Asset[] = response.assets as Asset[];
                    setSelectedImage(`${source[0].uri}`);
                    setImageFile(source[0].base64);
                    // console.log('File:', source[0].base64);
                  }
                },
              );
            }}>
            <Icon name="camera" size={40} color={Colors.icon.lightgrey} />
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity
          style={{marginVertical: 10}}
          onPress={async () => {
            await launchImageLibrary(
              // If need base64String, include this option:
              // includeBase64: true
              {mediaType: 'mixed', includeBase64: true},
              response => {
                // console.log('Response = ', response);

                if (response.didCancel) {
                  console.log('User cancelled image picker');
                } else if (response.errorMessage) {
                  console.log('ImagePicker Error: ', response.errorMessage);
                } else {
                  let source: Asset[] = response.assets as Asset[];
                  setSelectedImage(`${source[0].uri}`);
                  setImageFile(source[0].base64);
                  // console.log('File:', source[0].base64);
                }
              },
            );
          }}>
          <Text style={{color: Colors.text}}>Chỉnh sửa ảnh sản phẩm</Text>
        </TouchableOpacity> */}

        <Formik
          initialValues={initialValues}
          onSubmit={(values, {resetForm}) => {
            const reqDto: ICreateItemReq = {
              addedBy: userStore.id ?? 'unknown',
              groupProductId: values.groupProductId,
              storageLocationId: values.storageLocationId,
              purchaseLocationId: values.purchaseLocationId,
              bestBefore: moment(values.bestBefore, 'DD/MM/YYYY').toISOString(),
              unit: values.unit,
              quantity: parseInt(values.quantity),
              image: imageFile,
            };

            console.log('reqDto:', JSON.stringify(reqDto, null, 2));

            createItem(reqDto)
              .then(res => {
                if (res.statusCode === 201) {
                  Toast.show({
                    type: 'success',
                    text1: 'Thêm nhu yếu phẩm thành công',
                    visibilityTime: 1000,
                    autoHide: true,
                    onHide: () => {
                      navigation.goBack();
                    },
                  });
                }
              })
              .catch(err => {
                console.log('createItem:', err);
              })
              .finally(() => {
                resetForm();
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
              <GroupProductDropdownPicker
                navigation={navigation}
                groupId={groupStore.id}
                fnUpdateGpImage={setSelectedImage}
                fnUpdateGroupProductId={value =>
                  setFieldValue('groupProductId', value)
                }
              />

              {/* bestBefore */}
              <Text style={styles.inputLabel}>Hạn sử dụng</Text>
              <View style={styles.infoInput}>
                <TextInput
                  editable={false}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Hạn sử dụng'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.bestBefore}
                />

                {/* bestBefore */}
                <DatePicker
                  modal
                  open={open}
                  date={selectedDate}
                  mode={'date'}
                  locale={'vi'}
                  title={'Chọn ngày'}
                  confirmText={'Chọn'}
                  cancelText={'Huỷ'}
                  onConfirm={value => {
                    console.log('Selected exp date:', value);

                    setOpen(false);
                    // setDate(value);
                    setFieldValue(
                      'bestBefore',
                      moment(value).format('DD/MM/YYYY'),
                    );
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />

                {values.bestBefore && (
                  <Icon
                    onPress={() => setFieldValue('bestBefore', '')}
                    name={'close'}
                    style={[styles.icon, {marginRight: 5}]}
                  />
                )}
                <Icon
                  onPress={() => {
                    setOpen(true);
                  }}
                  name={'calendar'}
                  style={styles.icon}
                />
              </View>

              {/* quantity */}
              <Text style={styles.inputLabel}>Số lượng</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('quantity', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('quantity')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Số lượng'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.quantity}
                  keyboardType={'numeric'}
                />

                {values.quantity && (
                  <Icon
                    onPress={() => setFieldValue('quantity', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              {/* unit */}
              <Text style={styles.inputLabel}>Đơn vị tính</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('unit', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('unit')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Đơn vị tính'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.unit}
                />

                {values.unit && (
                  <Icon
                    onPress={() => setFieldValue('unit', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <StorageLocationDropdownPicker
                navigation={navigation}
                groupId={groupStore.id}
                fnUpdateStorageLocationId={value =>
                  setFieldValue('storageLocationId', value)
                }
              />

              <PurchaseLocationDropdownPicker
                navigation={navigation}
                groupId={groupStore.id}
                fnUpdatePurchaseLocationId={value =>
                  setFieldValue('purchaseLocationId', value)
                }
              />

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AddProdInfoScreen;
