import {Formik} from 'formik';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Asset, launchCamera} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import {RouteProp, useRoute} from '@react-navigation/native';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import {dateFormat} from '../../../../common/handle.string';
import groupStore from '../../../../common/store/group.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import GroupProductDropdownPicker from '../../components/GroupProductDropdownPicker';
import StorageLocationDropdownPicker from '../../components/StorageLocationDropdownPicker';
import {IGetStorageLocationByIdReq} from '../../interfaces/storage-locations/index';
import {getStorageLocationById} from '../../services/storage-location.service';

const StorageSchema = Yup.object().shape({
  name: Yup.string().required('Vui lòng nhập vị trí lưu trữ'),
});

type StorageLocationRouteParams = {
  groupId: string;
  storageLocationId: string;
};

// Specify the type for the route
type StorageLocationRouteProp = RouteProp<
  Record<string, StorageLocationRouteParams>,
  string
>;

const EditStorageLocationDetailScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<StorageLocationRouteProp>();
  const {groupId, storageLocationId} = route.params;

  const [location, setLocation] = useState<{
    addedBy: string;
    description: string;
    id: string;
    image: string;
    name: string;
    timestamp: {
      createdAt: Date | string;
      deletedAt: Date | null;
      updatedAt: Date | string;
    };
  }>({
    addedBy: '',
    description: '',
    id: '',
    image: '',
    name: '',
    timestamp: {
      createdAt: new Date() || '',
      deletedAt: null,
      updatedAt: new Date() || '',
    },
  });
  const [selectedImage, setSelectedImage] = useState(IMAGE_URI_DEFAULT);
  const [imageFile, setImageFile] = useState<any>();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getStorageLocationDetail = async () => {
    const reqObj: IGetStorageLocationByIdReq = {
      groupId: groupId,
      id: storageLocationId,
    };
    const response = await getStorageLocationById(reqObj);
    console.log('Get storage loca:', response.data);

    if (response.data) {
      setLocation({
        addedBy: response?.data?.addedBy ?? '',
        description: response?.data?.description ?? '',
        id: response?.data?.id ?? '',
        image: response?.data?.image ?? IMAGE_URI_DEFAULT,
        name: response?.data?.name ?? '',
        timestamp: {
          createdAt: response?.data?.timestamp?.createdAt ?? '',
          deletedAt: response?.data?.timestamp?.deletedAt ?? null,
          updatedAt: response?.data?.timestamp?.updatedAt ?? '',
        },
      });

      setSelectedImage(response?.data?.image ?? IMAGE_URI_DEFAULT);
    }
  };

  useEffect(() => {
    getStorageLocationDetail();
  }, []);

  useEffect(() => {
    console.log('location: ', location);
  }, [location]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={{
            display: 'flex',
            // position: 'absolute',
            // right: 15,
            // bottom: 10,
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
          <Image source={{uri: selectedImage}} style={styles.image} />

          <Ionicons
            name="camera"
            size={40}
            color={Colors.icon.lightgrey}
            style={{
              position: 'absolute',
              right: 10,
              bottom: 5,
            }}
          />
        </TouchableOpacity>
      </View>

      <Formik
        initialValues={{
          name: location.name,
          description: location.description,
        }}
        validationSchema={StorageSchema}
        enableReinitialize={true}
        onSubmit={values => {
          console.log('values:', values);
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
                  setFieldValue('name', value);
                }}
                onBlur={() => setFieldTouched('name')}
                style={{flex: 1, color: Colors.text.grey}}
                placeholder={'Vị trí lưu trữ'}
                placeholderTextColor={Colors.text.lightgrey}
                value={values.name}
              />

              {values.name && (
                <Ionicons
                  onPress={() => setFieldValue('name', '')}
                  name={'close'}
                  style={styles.icon}
                />
              )}
            </View>
            {errors.name && touched.name && (
              <Text
                style={{
                  width: '90%',
                  color: Colors.text.red,
                  textAlign: 'left',
                }}>
                {errors.name}
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
                <Ionicons
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
    backgroundColor: Colors.background.white,
  },
  contentContainer: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 10,
    marginVertical: 10,
    // backgroundColor: 'pink',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
    borderColor: Colors.border.lightgrey,
    borderWidth: 1,
  },
  labelText: {
    color: Colors.title.orange,
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoInput: {
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 15,
    marginTop: -5,
    marginBottom: 5,
    borderColor: Colors.border.lightgrey,
    borderBottomWidth: 1,
    // borderRadius: 10,
  },
  icon: {
    fontWeight: '200',
    color: Colors.icon.lightgrey,
    fontSize: 20,
  },
  button: {
    width: '100%',
    height: 40,
    marginVertical: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.buttonBackground.orange,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.buttonText.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditStorageLocationDetailScreen;
