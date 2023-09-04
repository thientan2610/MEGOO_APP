import {Formik} from 'formik';
import {observer} from 'mobx-react';
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
import {Asset, launchCamera} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import AddImageModal from '../../../../common/components/AddImageModal';
import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import appStore from '../../../../common/store/app.store';
import groupStore from '../../../../common/store/group.store';
import {Colors} from '../../../../constants/color.const';
import {ICreateGroupProductReq} from '../../interfaces/group-products';
import {createGroupProduct} from '../../services/group-products.service';
import styles from './styles/style';

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    // .email('Email không hợp lệ')
    .required('Vui lòng nhập tên nhu yếu phẩm'),
});

const AddGroupProductScreen = ({navigation}: {navigation: any}) => {
  const initialValues = {
    name: '',
    barcode: '',
    price: '',
    region: '',
    brand: '',
    category: '',
    description: '',
  };

  const [selectedImage, setSelectedImage] = useState(IMAGE_URI_DEFAULT);
  const [imageFile, setImageFile] = useState<any>();
  const [modalState, setModalState] = useState(false);

  useEffect(() => {
    appStore.setSearchActive(false);
  }, []);

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
              right: 20,
              bottom: 0,
            }}
            onPress={async () => {
              setModalState(true);
            }}>
            <Icon name="camera" size={40} color={Colors.icon.lightgrey} />
          </TouchableOpacity>
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={ProductSchema}
          onSubmit={(values, {resetForm}) => {
            console.log('values:', values);

            // if (!values.name) {
            //   Toast.show({
            //     type: 'error',
            //     text1: 'Vui lòng nhập tên mẫu mã nhu yếu phẩm',
            //     visibilityTime: 1000,
            //     autoHide: true,
            //   });
            //   return;
            // }

            const reqDto: ICreateGroupProductReq = {
              name: values.name,
              image: imageFile !== IMAGE_URI_DEFAULT ? imageFile : undefined,
              barcode: values.barcode,
              price: parseInt(values.price),
              region: values.region,
              brand: values.brand,
              category: values.category,
              description: values.description,
              groupId: groupStore.id,
            };

            createGroupProduct(reqDto)
              .then(resp => {
                if (resp.statusCode.toString().startsWith('2')) {
                  Toast.show({
                    type: 'success',
                    text1: 'Thêm mẫu mã nhu yếu phẩm thành công',
                    visibilityTime: 1000,
                    autoHide: true,
                    onHide: () => {
                      navigation.goBack();
                    },
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: 'Thêm mẫu mã nhu yếu phẩm thất bại',
                    visibilityTime: 1000,
                    autoHide: true,
                  });
                }
              })
              .catch(err => {
                Toast.show({
                  type: 'error',
                  text1: 'Thêm mẫu mã nhu yếu phẩm thất bại',
                  visibilityTime: 1000,
                  autoHide: true,
                });
              })
              .finally(() => {
                resetForm();
                setSelectedImage(IMAGE_URI_DEFAULT);
                setImageFile(undefined);
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
              <Text style={styles.inputLabel}>Barcode</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('barcode', value);
                  }}
                  onBlur={() => setFieldTouched('barcode')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập barcode'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.barcode}
                />

                {values.barcode && (
                  <Icon
                    onPress={() => setFieldValue('barcode', '')}
                    name={'close'}
                    style={[styles.icon, {marginRight: 5}]}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Nhu yếu phẩm</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('name', value);
                  }}
                  onBlur={() => setFieldTouched('name')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập tên nhu yếu phẩm'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.name}
                />

                {values.name && (
                  <Icon
                    onPress={() => setFieldValue('name', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>
              {touched.name && errors.name && (
                <Text
                  style={{
                    width: '100%',
                    color: Colors.text.red,
                    textAlign: 'left',
                  }}>
                  {errors.name}
                </Text>
              )}

              <Text style={styles.inputLabel}>Giá tiền</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('price', value);
                  }}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập giá tiền'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.price.toString()}
                  keyboardType="numeric"
                />

                {values.price && (
                  <Icon
                    onPress={() => setFieldValue('price', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Nơi sản xuất</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('region', value);
                  }}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập nơi sản xuất'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.region}
                />

                {values.region && (
                  <Icon
                    onPress={() => setFieldValue('region', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Nhãn hiệu</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('brand', value);
                  }}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập tên nhãn hiệu'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.brand}
                />

                {values.brand && (
                  <Icon
                    onPress={() => setFieldValue('brand', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Phân loại</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('category', value);
                  }}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Phân loại nhu yếu phẩm'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.category}
                />

                {values.category && (
                  <Icon
                    onPress={() => setFieldValue('category', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <Text style={styles.inputLabel}>Mô tả</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('description', value);
                  }}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập mô tả'}
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

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <AddImageModal
          key="addImageModal"
          title={'Chọn hình ảnh'}
          isModalOpen={modalState}
          setIsModalOpen={setModalState}
          fnUpdateSelectedImage={setSelectedImage}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default observer(AddGroupProductScreen);
