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
import styles from './styles/style';
import {ICreateNewGroupProductReq} from '../../interfaces/new-group-products';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import {createNewGroupProduct} from '../../services/new-group-products.service';

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    // .email('Email không hợp lệ')
    .required('Vui lòng nhập tên nhu yếu phẩm'),
});

const AddNewGroupProductScreen = ({navigation}: {navigation: any}) => {
  const initialValues = {
    name: '',
    bestBefore: '',
    price: '',
    image: undefined,
    startFrom: '',
    interval: '1',
    intervalType: 'monthly',
  };

  const dropdownData = [
    {label: 'Ngày', value: 'daily'},
    {label: 'Tháng', value: 'monthly'},
    {label: 'Năm', value: 'yearly'},
  ];
  const [value, setValue] = useState('monthly');
  const [isFocus, setIsFocus] = useState(false);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

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

            const reqDto: ICreateNewGroupProductReq = {
              name: values.name,
              image: imageFile !== IMAGE_URI_DEFAULT ? imageFile : undefined,
              price:
                values.price.length > 0 ? parseInt(values.price) : undefined,
              bestBefore: moment.isDate(values.bestBefore)
                ? values.bestBefore
                : undefined,
              groupId: groupStore.id,
              interval: parseInt(values.interval),
              intervalType: value,
              file: selectedImage !== IMAGE_URI_DEFAULT ? imageFile : undefined,
            };

            console.log('reqDto:', reqDto);

            createNewGroupProduct(reqDto)
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
                setValue('monthly');
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
              <Text style={styles.inputLabel}>
                Nhu yếu phẩm <Text style={{color: 'red'}}>*</Text>
              </Text>
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

              <Text style={styles.inputLabel}>Chu kỳ mua mới</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('interval', value);
                  }}
                  style={{width: 200, color: Colors.text.grey}}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.interval.toString()}
                  keyboardType="numeric"
                />
                <Dropdown
                  style={{
                    width: '40%',
                  }}
                  data={dropdownData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select item' : '...'}
                  searchPlaceholder="Search..."
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                  }}
                />
              </View>

              <Text style={styles.inputLabel}>Hạn sử dụng</Text>
              <View style={[styles.infoInput]}>
                <TextInput
                  editable={false}
                  // onChangeText={value => setFieldValue('dob', value)}
                  onBlur={() => setFieldTouched('dob')}
                  placeholder={'Nhập hạn sử dụng (không bắt buộc)'}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.bestBefore}
                />

                <DatePicker
                  modal
                  open={open}
                  date={date}
                  mode={'date'}
                  locale={'vi'}
                  title={'Chọn ngày'}
                  confirmText={'Chọn'}
                  cancelText={'Huỷ'}
                  onDateChange={value => {
                    console.log('Date change value:', value);

                    setDate(value);
                  }}
                  onConfirm={value => {
                    console.log('Selected dob:', value);

                    setOpen(false);
                    setDate(value);
                    setFieldValue(
                      'bestBefore',
                      moment(value).format('DD/MM/YYYY'),
                    );

                    values.bestBefore = moment(value).format('DD/MM/YYYY');

                    console.log('Values dob', values);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />

                {values.bestBefore && (
                  <Icon
                    onPress={() => setFieldValue('bestBefore', '')}
                    name={'close'}
                    style={[styles.inputIcon, {marginRight: 5}]}></Icon>
                )}
                <Icon
                  onPress={() => {
                    setOpen(true);
                  }}
                  name={'calendar'}
                  style={styles.inputIcon}></Icon>
              </View>

              <Text style={styles.inputLabel}>Giá tiền</Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('price', value);
                  }}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập giá NYP (không bắt buộc)'}
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

export default observer(AddNewGroupProductScreen);
