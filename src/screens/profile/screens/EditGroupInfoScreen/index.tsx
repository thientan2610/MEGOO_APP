import {Formik} from 'formik';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import {RouteProp, useRoute} from '@react-navigation/native';

import {IMAGE_URI_DEFAULT} from '../../../../common/default';
import groupStore from '../../../../common/store/group.store';
import {Colors} from '../../../../constants/color.const';
import {getGroupById} from '../../../../services/group.service';
import {
  updateGroupAvatar,
  updateGroupName,
  uploadGroupAvatarWithBase64,
} from './services/group.info.service';

// Define the type for the route params
type GroupAvatarRouteParams = {
  avatarUrl: string;
  groupId: string;
};

// Specify the type for the route
type GroupAvatarRouteProp = RouteProp<
  Record<string, GroupAvatarRouteParams>,
  string
>;

const ChangeGroupNameSchema = Yup.object().shape({
  name: Yup.string().required('Vui lòng nhập tên nhóm'),
});

const EditGroupinfoScreen = () => {
  const route = useRoute<GroupAvatarRouteProp>();
  const {avatarUrl} = route.params;
  const groupId = groupStore.id;

  const [group, setGroup] = useState({
    name: '',
    avatar: '',
  });

  const [selectedImage, setSelectedImage] = useState('');
  const [imageFile, setImageFile] = useState<any>();

  const getGroupInfo = async () => {
    const response = await getGroupById(groupId);
    console.log('Group info:', response.group);

    setGroup({
      name: response?.group?.name,
      avatar: response?.group?.avatar,
    });
  };

  useEffect(() => {
    console.log(route.params.avatarUrl);
    console.log(route.params.groupId);
    getGroupInfo();

    setTimeout(() => {
      console.log(group.name);
    }, 1000);
  }, []);

  const initialValues = {
    name: group.name,
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={ChangeGroupNameSchema}
      onSubmit={async values => {
        console.log(values);

        if (values.name !== group.name) {
          const response = await updateGroupName(groupId, values.name);

          console.log('response', response);
        }

        if (selectedImage !== '') {
          const fileExtension = selectedImage.split('.').pop();
          const base64String = `data:image/${fileExtension};base64,${imageFile}`;

          const response = await updateGroupAvatar(groupId, base64String);

          // console.log('response', response);
        }
      }}>
      {({
        values,
        errors,
        touched,
        setFieldTouched,
        setFieldValue,
        isValid,
        handleSubmit,
      }) => (
        <View style={styles.container}>
          <TouchableOpacity
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignSelf: 'center',
              marginVertical: 10,
            }}
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
            <Image
              source={{
                uri: selectedImage
                  ? selectedImage
                  : group?.avatar || IMAGE_URI_DEFAULT,
              }}
              style={styles.avatar}
            />
            <View
              style={{
                display: 'flex',
                position: 'absolute',
                right: 20,
                bottom: 10,
              }}>
              <Ionicons name="camera" size={40} color={Colors.text.grey} />
            </View>
          </TouchableOpacity>

          <Text style={styles.title}>Tên nhóm</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={values.name}
              onChangeText={value => setFieldValue('name', value)}
              onBlur={() => setFieldTouched('name')}
              placeholder="Nhập tên nhóm"
              style={{
                width: '90%',
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                // paddingHorizontal: 15,
                borderRadius: 10,
              }}
            />

            {values.name && (
              <Ionicons
                onPress={() => setFieldValue('name', '')}
                name={'close'}
                style={{
                  fontWeight: '200',
                  color: Colors.icon.lightgrey,
                  fontSize: 20,
                }}
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

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isValid}
            style={[
              styles.button,
              {
                backgroundColor: isValid
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.lightorange,
              },
            ]}>
            <Text style={styles.buttonText}>Lưu thông tin</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: Colors.background.white,
    width: Dimensions.get('window').width,
    minHeight: Dimensions.get('window').height,
  },
  title: {
    width: '90%',
    textAlign: 'left',
    color: Colors.title.orange,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  avatar: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
    borderRadius: (Dimensions.get('window').width * 0.5) / 2,
    marginVertical: 10,
  },
  inputContainer: {
    width: '90%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginVertical: 10,
    borderColor: Colors.border.lightgrey,
    borderBottomWidth: 1,
    // borderRadius: 10,
  },
  button: {
    width: '90%',
    content: 'fill',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginVertical: 20,
    padding: 8,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.buttonText.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default EditGroupinfoScreen;
