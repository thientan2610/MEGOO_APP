import {Formik} from 'formik';
import {observer} from 'mobx-react';
import {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import appStore from '../../../../common/store/app.store';
import groupStore from '../../../../common/store/group.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {IPurchaseLocation} from '../../interfaces/base-dto/purchase-location.interface';
import * as ps from '../../services/purchase-locations.service';
import {RouteParamsProductsScreen} from '../ProductsScreen/props-products-screen';
import {IRouteParamsStorageLocationScreen} from './route-param.interface';
import styles from './styles/style';

const PurchaseLocationScreen = ({navigation}: {navigation: any}) => {
  const props = navigation?.route?.params as IRouteParamsStorageLocationScreen;
  console.log('props:', props);

  const [addLocModalVisible, setAddLocModalVisible] = useState(false);
  const [locations, setLocations] = useState<IPurchaseLocation[]>([]);

  useEffect(() => {
    if (groupStore.id === '' || !groupStore.id) {
      return;
    }

    ps.getPurchaseLocationPaginated({
      groupId: groupStore.id,
    }).then(res => {
      if (res && res.data && res.data.length > 0) {
        setLocations(res.data);
      }
    });

    // reset searchActive when unmount
    return () => {
      appStore.setSearchActive(false);
    };
  }, []);

  const renderLocationItem = (purLoc: IPurchaseLocation) => {
    const routeParam: RouteParamsProductsScreen = {
      groupId: props?.groupId,
      storageLocation: purLoc,
    };

    return (
      <TouchableOpacity
        style={styles.locationContainer}
        key={purLoc.id}
        onPress={() => {
          navigation.navigate(RouteNames.PRODUCTS, routeParam);
        }}>
        <Image
          source={{
            uri:
              purLoc.image ||
              'https://res.cloudinary.com/nightowls19vp/image/upload/v1687419179/default.png',
          }}
          style={styles.locationImg}
        />
        <View style={styles.locationInfoContainer}>
          <View style={[styles.locationInfoRow]}>
            <Text style={styles.text}>Nơi mua sắm:</Text>
            <Text style={[styles.text, {fontWeight: 'bold'}]} numberOfLines={3}>
              {purLoc?.name}
            </Text>
          </View>
          <View style={[styles.locationInfoRow]}>
            <Text style={styles.text}>Địa chỉ:</Text>
            <Text
              style={[
                styles.text,
                {flexWrap: 'wrap', fontWeight: 'bold', marginTop: -5},
              ]}
              numberOfLines={3}>
              {[
                purLoc?.address?.addressLine1,
                purLoc?.address?.addressLine2,
                purLoc?.address?.wardName,
                purLoc?.address?.districtName,
                purLoc?.address?.provinceName,
              ]
                .filter(Boolean)
                .join(', ')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return appStore.isLoggedIn ? (
    <View style={{...styles.container, paddingBottom: 50}}>
      <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={styles.title}>Nơi mua sắm</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(RouteNames.ADD_PURCHASE_LOCATION, {
              groupId: props?.groupId,
            })
          }>
          <Icon
            name="add-circle-outline"
            size={24}
            color={Colors.icon.orange}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={addLocModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddLocModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: '90%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: Colors.background.white,
              padding: 20,
              borderRadius: 5,
            }}>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '15%',
                }}
              />
              <Text
                style={{
                  width: '70%',
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: Colors.icon.orange,
                }}>
                Thêm nơi mua sắm
              </Text>
              <TouchableOpacity
                style={{
                  width: '15%',
                }}
                onPress={() => {
                  setAddLocModalVisible(false);
                }}>
                <Icon
                  name="close"
                  size={22}
                  color={Colors.icon.orange}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                  }}
                />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={{location: '', description: ''}}
              onSubmit={values => {
                console.log('values:', values);
                setAddLocModalVisible(false);
                setLocations(prevLocations => [
                  ...prevLocations,
                  {
                    name: values.location,
                    description: values.description,
                  },
                ]);

                console.log('locations:', locations);
              }}>
              {({
                values,
                errors,
                touched,
                handleSubmit,
                setFieldTouched,
                setFieldValue,
              }) => (
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    marginTop: 20,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: 40,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 15,
                      borderColor: Colors.border.lightgrey,
                      borderWidth: 1,
                      borderRadius: 10,
                    }}>
                    <TextInput
                      onChangeText={value => {
                        setFieldValue('location', value);
                      }}
                      // onSubmitEditing={handleSubmit}
                      onBlur={() => setFieldTouched('location')}
                      style={{flex: 1, color: Colors.text.grey}}
                      placeholder={'Vị trí lưu trữ'}
                      placeholderTextColor={Colors.border.lightgrey}
                      value={values.location}
                    />

                    {values.location && (
                      <Icon
                        onPress={() => setFieldValue('location', '')}
                        name={'close'}
                        style={{
                          fontWeight: '200',
                          color: Colors.icon.lightgrey,
                          fontSize: 20,
                        }}></Icon>
                    )}
                  </View>

                  <View
                    style={{
                      width: '100%',
                      height: 40,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 15,
                      borderColor: Colors.border.lightgrey,
                      borderWidth: 1,
                      borderRadius: 10,
                    }}>
                    <TextInput
                      onChangeText={value => {
                        setFieldValue('description', value);
                      }}
                      // onSubmitEditing={handleSubmit}
                      onBlur={() => setFieldTouched('description')}
                      style={{flex: 1, color: Colors.text.grey}}
                      placeholder={'Ghi chú'}
                      placeholderTextColor={Colors.secondary}
                      value={values.description}
                    />

                    {values.description && (
                      <Icon
                        onPress={() => setFieldValue('description', '')}
                        name={'close'}
                        style={{
                          fontWeight: '200',
                          color: Colors.icon.lightgrey,
                          fontSize: 20,
                        }}></Icon>
                    )}
                  </View>

                  <TouchableOpacity
                    style={{
                      width: '40%',
                      height: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: Colors.buttonBackground.orange,
                      borderRadius: 10,
                    }}
                    onPress={handleSubmit}>
                    <Text
                      style={{
                        color: Colors.text.white,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      Lưu
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>

      {/* <ScrollView contentContainerStyle={styles.locationsContainer}>
        {renderLocationItem()}
      </ScrollView> */}
      <FlatList
        data={locations}
        keyExtractor={item =>
          item?.id?.toString() ?? new Date().getTime().toString()
        }
        renderItem={({item}) => renderLocationItem(item)}
        contentContainerStyle={styles.container}
        // onEndReached={fetchMoreData} // Add your function to fetch more data here
        onEndReachedThreshold={0.2} // Adjust the threshold as needed
        ListEmptyComponent={() => (
          <View
            style={{
              marginTop: 20,
            }}>
            <Text
              style={{
                color: Colors.text.grey,
                fontSize: 14,
              }}>
              Không có nơi mua sắm nào
            </Text>
          </View>
        )}
      />
      {/* {locations.length > 0 ? {} : null } */}
    </View>
  ) : (
    <View style={styles.loginContainer}>
      <Image
        source={require('../../../../../assets/food.png')}
        style={{
          width: '100%',
          height: 100,
          // backgroundColor: Colors.border.lightgrey,
          resizeMode: 'center',
          marginBottom: 50,
        }}
      />
      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>Vui lòng </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(RouteNames.LOGIN, {});
          }}>
          <Text style={[styles.loginText, {color: Colors.text.orange}]}>
            đăng nhập/đăng ký
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.loginText}>để sử dụng chức năng này.</Text>
    </View>
  );
};

export default observer(PurchaseLocationScreen);
