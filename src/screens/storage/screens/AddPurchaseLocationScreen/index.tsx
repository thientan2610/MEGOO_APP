import {Formik} from 'formik';
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
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';

import AddImageModal from '../../../../common/components/AddImageModal';
import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import appStore from '../../../../common/store/app.store';
import groupStore from '../../../../common/store/group.store';
import userStore from '../../../../common/store/user.store';
import {Colors} from '../../../../constants/color.const';
import {IDistrict} from '../../interfaces/base-dto/district.interfaces';
import {IProvince} from '../../interfaces/base-dto/province.interface';
import {IWard} from '../../interfaces/base-dto/ward.interface';
import {
  ICreatePurchaseLocationReq,
  ICreatePurchaseLocationRes,
} from '../../interfaces/purchase-locations';
import {createPurchaseLocation} from '../../services/purchase-locations.service';
import DistrictsDropdownPicker from './components/districts-dropdown-picker';
import ProvincesDropdownPicker from './components/provinces-dropdown-picker';
import WardsDropdownPicker from './components/wards-dropdown-picker';
import styles from './styles/style';

const AddProdInfoScreen = ({navigation}: {navigation: any}) => {
  const initialValues: ICreatePurchaseLocationReq = {
    name: '',
    addedBy: '',
    address: {
      addressLine1: '',
      addressLine2: undefined,
      provinceName: '',
      districtName: '',
      wardName: '',
    },
    image: IMAGE_URI_DEFAULT,
    description: '',
    groupId: groupStore.id,
  };

  const [p, setP] = useState<IProvince>();
  const [d, setD] = useState<IDistrict>();
  const [w, setW] = useState<IWard>();
  const [modalState, setModalState] = useState(false);

  useEffect(() => {
    appStore.setSearchActive(false);
  }, []);

  useEffect(() => {
    setD(undefined);
    setW(undefined);
  }, [p]);

  useEffect(() => {
    setW(undefined);
  }, [d]);

  const [selectedImage, setSelectedImage] = useState(IMAGE_URI_DEFAULT);
  const [imageFile, setImageFile] = useState<any>();

  type TSetFieldValue = (
    field: string,
    value: any,
    shouldValidate?: boolean,
  ) => void;

  const renderProvinceDropdownPicker = (
    p?: IProvince,
    setFieldValue?: TSetFieldValue,
  ) => {
    return (
      <ProvincesDropdownPicker
        fnUpdateProvince={(p: IProvince) => {
          setP(p);
          if (setFieldValue) {
            setFieldValue('address.provinceName', p.name);
          }
        }}
        key={'province-dropdown-picker'}
      />
    );
  };

  const renderDistrictDropdownPicker = (
    d?: IDistrict,
    p?: number,
    setFieldValue?: TSetFieldValue,
  ) => {
    return (
      <DistrictsDropdownPicker
        disabled={!p}
        pCode={p}
        fnUpdateDistrict={(d: IDistrict) => {
          setD(d);
          if (setFieldValue) {
            setFieldValue('address.districtName', d.name);
          }
        }}
        key={
          'district-dropdown-picker-for-province-' + p ||
          'district-dropdown-picker-for-province-'
        }
      />
    );
  };

  const renderWardDropdownPicker = (
    w?: IWard,
    d?: number,
    setFieldValue?: TSetFieldValue,
  ) => {
    return (
      <WardsDropdownPicker
        dCode={d}
        disabled={!d}
        fnUpdateWard={(w: IWard) => {
          setW(w);
          if (setFieldValue) {
            setFieldValue('address.wardName', w.name);
          }
        }}
        key={
          'ward-dropdown-picker-for-district-' + d ||
          'ward-dropdown-picker-for-district-'
        }
      />
    );
  };

  return (
    <ScrollView
    // contentContainerStyle={styles.container}
    // nestedScrollEnabled={true}
    >
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: selectedImage ?? imageFile ?? IMAGE_URI_DEFAULT,
            }}
            style={styles.image}
          />

          <TouchableOpacity
            style={{
              display: 'flex',
              position: 'absolute',
              right: 10,
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
          onSubmit={(values, {resetForm}) => {
            console.log('values:', JSON.stringify(values, null, 2));

            const req: ICreatePurchaseLocationReq = {
              ...values,
              addedBy: userStore.id,
              image: imageFile !== IMAGE_URI_DEFAULT ? imageFile : undefined,
            };

            createPurchaseLocation(req)
              .then((res: ICreatePurchaseLocationRes) => {
                console.log('res:', JSON.stringify(res, null, 2));
                if (res.statusCode === 201) {
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
                console.log('err:', JSON.stringify(err, null, 2));

                Toast.show({
                  type: 'error',
                  text1: 'Thêm nơi lưu trữ thất bại',
                  visibilityTime: 1000,
                  autoHide: true,
                });
              })
              .finally(() => {
                // reset form
                setSelectedImage(IMAGE_URI_DEFAULT);
                setImageFile(undefined);
                setP(undefined);
                setD(undefined);
                setW(undefined);
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
              <Text
                style={{
                  fontWeight: 'bold',
                  alignSelf: 'flex-start',
                  color: Colors.text.orange,
                  // marginBottom: 10,
                  fontSize: 16,
                }}>
                Tên địa điểm
              </Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('name', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('name')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập tên địa điểm ...'}
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

              {renderProvinceDropdownPicker(p, setFieldValue)}

              {renderDistrictDropdownPicker(d, p?.code, setFieldValue)}

              {renderWardDropdownPicker(w, d?.code, setFieldValue)}

              <Text
                style={{
                  fontWeight: 'bold',
                  alignSelf: 'flex-start',
                  color: Colors.text.orange,
                  marginTop: 10,
                  fontSize: 16,
                }}>
                Địa chỉ chi tiết
              </Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('address.addressLine1', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('address.addressLine1')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập địa chỉ chi tiết ...'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.address?.addressLine1 || ''}
                />

                {values.address?.addressLine1 && (
                  <Icon
                    onPress={() => setFieldValue('address.addressLine1', '')}
                    name={'close'}
                    style={styles.icon}
                  />
                )}
              </View>

              <Text
                style={{
                  fontWeight: 'bold',
                  alignSelf: 'flex-start',
                  color: Colors.text.orange,
                  marginTop: 10,
                  fontSize: 16,
                }}>
                Mô tả
              </Text>
              <View style={styles.infoInput}>
                <TextInput
                  onChangeText={value => {
                    setFieldValue('description', value);
                  }}
                  // onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('description')}
                  style={{flex: 1, color: Colors.text.grey}}
                  placeholder={'Nhập mô tả ...'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.description || ''}
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
