import {observer} from 'mobx-react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Slider from '@react-native-community/slider';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';

import {splitString} from '../../../../common/handle.string';
import {
  ICartItem,
  ICartList,
  IUserCart,
} from '../../../../common/interfaces/package.interface';
import appStore from '../../../../common/store/app.store';
import userStore from '../../../../common/store/user.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {getUserCart} from '../CartScreen/services/cart.service';
import {getAllPackage, updateCart} from './services/package.service';
import styles from './styles/style';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PackageScreen = ({navigation}: {navigation: any}) => {
  const [packages, setPackages] = useState([]);
  const [isExtended, setIsExtended] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const getPackages = async () => {
    const pkgs = await getAllPackage();
    setPackages(pkgs.data);
  };

  useEffect(() => {
    getPackages();
    console.log('split string:', splitString('7000000'));
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsExtended(appStore.getIsExtendedPkg());
    }, []),
  );

  const renderItem = ({item}: {item: any}) => {
    const [noOfMemb, setNoOfMemb] = useState(item.noOfMember);
    const [duration, setDuration] = useState(item.duration);
    const [totalPrice, setTotalPrice] = useState(item.price);

    const calculatePrice = () => {
      if (item.name === 'Family Package') {
        let price = (item.price + item.noOfMember * item.duration * 0) * 0.7;

        setTotalPrice(price);
      } else if (item.name === 'Customized Package') {
        let price =
          duration >= 12
            ? (item.price + (noOfMemb - 2) * duration * item.coefficient) * 0.7
            : item.price + (noOfMemb - 2) * duration * item.coefficient;

        let roundPrice = Math.round(price);

        setTotalPrice(roundPrice);
      } else if (item.name === 'Annual Package') {
        let price =
          (item.price + (noOfMemb - 2) * item.duration * item.coefficient) *
          0.7;

        let roundPrice = Math.round(price);

        setTotalPrice(roundPrice);
      } else if (item.name === 'Experience Package') {
        let price =
          item.price + (noOfMemb - 2) * item.duration * item.coefficient;

        setTotalPrice(price);
      }
    };

    useEffect(() => {
      calculatePrice();
    }, [noOfMemb, duration]);

    return (
      <View style={styles.carouselItemContainer} key={item._id}>
        <View style={styles.carouselItem}>
          <View>
            <Text style={styles.pkgTitle} numberOfLines={2}>
              {item.name}
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.text}>Thời hạn:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {duration !== item.duration ? duration : item.duration} tháng
              </Text>
            </View>
            {item.name === 'Customized Package' ? (
              <Slider
                style={{width: '100%', height: 30}}
                step={1}
                value={duration !== item.duration ? duration : item.duration}
                minimumValue={0}
                maximumValue={12}
                lowerLimit={1}
                thumbTintColor={Colors.text.orange}
                minimumTrackTintColor={Colors.text.orange}
                maximumTrackTintColor={Colors.text.lightgrey}
                onValueChange={value => {
                  setDuration(value);
                }}
              />
            ) : null}

            <View
              style={
                // styles.infoRow
                {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }
              }>
              <Text style={styles.text}>Số lượng thành viên:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {noOfMemb !== item.noOfMember ? noOfMemb : item.noOfMember}{' '}
                người
              </Text>
            </View>
            {item.name !== 'Family Package' ? (
              <Slider
                style={{width: '100%', height: 30}}
                step={1}
                value={
                  noOfMemb !== item.noOfMember ? noOfMemb : item.noOfMember
                }
                minimumValue={0}
                maximumValue={10}
                thumbTintColor={Colors.text.orange}
                minimumTrackTintColor={Colors.text.orange}
                maximumTrackTintColor={Colors.text.lightgrey}
                lowerLimit={2}
                onValueChange={value => {
                  console.log('slider noofmemb value', value);

                  setNoOfMemb(value);
                }}
              />
            ) : null}

            <View
              style={
                // styles.infoRow
                {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }
              }>
              <Text style={styles.text}>Giá tiền: </Text>
              <Text style={[styles.text, {fontSize: 24, fontWeight: 'bold'}]}>
                {splitString(totalPrice.toString())} VNĐ
              </Text>
            </View>

            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <Text style={styles.text}>Mô tả:</Text>
              <Text
                style={[
                  styles.text,
                  {textAlign: 'center', fontWeight: 'bold'},
                ]}>
                {item.description}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {appStore.isLoggedIn ? (
              isExtended === true ? (
                <TouchableOpacity
                  style={styles.extendButton}
                  onPress={async () => {
                    appStore.setRenewPkgId(item._id);

                    // userStore.resetArray();
                    let selectedPkg = {
                      package: item._id,
                      noOfMember: noOfMemb,
                      duration: duration,
                    };

                    appStore.setRenewPkg(selectedPkg);
                    // Get user cart
                    const userCart: IUserCart = await getUserCart();
                    console.log('userCart res:', userCart);

                    const userCartList: ICartList = {
                      cart: [] as ICartItem[],
                    };

                    userCart.cart.map(object => {
                      let item = {
                        package: object._id,
                        noOfMember: object.noOfMember,
                        duration: object.duration,
                        quantity: object.quantity,
                      };

                      userCartList.cart.push(item);
                    });

                    userStore.setCartList(userCartList);

                    // Increase quantity for the same package
                    const index = userStore.cartList.cart.findIndex(
                      obj =>
                        obj.package === selectedPkg.package &&
                        obj.noOfMember === selectedPkg.noOfMember &&
                        obj.duration === selectedPkg.duration,
                    );

                    if (index === -1) {
                      userStore.cartList.cart.push({
                        ...selectedPkg,
                        quantity: 1,
                      });
                    } else {
                      userStore.cartList.cart[index].quantity++;
                    }

                    const response = await updateCart(userStore.cartList);

                    if (response.statusCode === 200) {
                      navigation.navigate(RouteNames.PAYMENT as never, {
                        totalPrice: totalPrice,
                        selectedItems: [
                          {
                            package: item._id,
                            name: item.name,
                            duration: item.duration,
                            noOfMember: item.noOfMember,
                            quantity: 1,
                            price: totalPrice,
                          },
                        ],
                      });
                    }
                  }}>
                  <Text style={styles.buttonText} numberOfLines={2}>
                    Mua ngay
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                      // userStore.resetArray();
                      let selectedPkg = {
                        package: item._id,
                        noOfMember: noOfMemb,
                        duration: duration,
                      };

                      // Get user cart
                      const userCart: IUserCart = await getUserCart();
                      console.log('userCart res:', userCart);

                      const userCartList: ICartList = {
                        cart: [] as ICartItem[],
                      };

                      userCart.cart.map(object => {
                        let item = {
                          package: object._id,
                          noOfMember: object.noOfMember,
                          duration: object.duration,
                          quantity: object.quantity,
                        };

                        userCartList.cart.push(item);
                      });

                      userStore.setCartList(userCartList);

                      // // Increase quantity for the same package
                      const index = userStore.cartList.cart.findIndex(
                        obj =>
                          obj.package === selectedPkg.package &&
                          obj.noOfMember === selectedPkg.noOfMember &&
                          obj.duration === selectedPkg.duration,
                      );

                      if (index === -1) {
                        userStore.cartList.cart.push({
                          ...selectedPkg,
                          quantity: 1,
                        });
                      } else {
                        userStore.cartList.cart[index].quantity++;
                      }

                      console.log('item noOfMember:', item.noOfMember);

                      updateCart(userStore.cartList).then(response => {
                        console.log('Update cart response:', response);

                        if (response.statusCode === 200) {
                          navigation.navigate(RouteNames.PAYMENT as never, {
                            totalPrice: totalPrice,
                            selectedItems: [
                              {
                                package: item._id,
                                name: item.name,
                                duration: selectedPkg.duration,
                                noOfMember: selectedPkg.noOfMember,
                                quantity: 1,
                                price: totalPrice,
                              },
                            ],
                          });
                        }
                      });
                    }}>
                    <Text style={styles.buttonText} numberOfLines={2}>
                      Mua ngay
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                      // userStore.resetArray();
                      let selectedPkg = {
                        package: item._id,
                        noOfMember: noOfMemb,
                        duration: duration,
                      };

                      // Get user cart
                      const userCart: IUserCart = await getUserCart();
                      console.log('userCart res:', userCart);

                      const userCartList: ICartList = {
                        cart: [] as ICartItem[],
                      };

                      userCart.cart.map(object => {
                        let item = {
                          package: object._id,
                          noOfMember: object.noOfMember,
                          duration: object.duration,
                          quantity: object.quantity,
                        };

                        userCartList.cart.push(item);
                      });

                      userStore.setCartList(userCartList);

                      // // Increase quantity for the same package
                      const index = userStore.cartList.cart.findIndex(
                        obj =>
                          obj.package === selectedPkg.package &&
                          obj.noOfMember === selectedPkg.noOfMember &&
                          obj.duration === selectedPkg.duration,
                      );

                      if (index === -1) {
                        userStore.cartList.cart.push({
                          ...selectedPkg,
                          quantity: 1,
                        });
                      } else {
                        userStore.cartList.cart[index].quantity++;
                      }

                      const response = await updateCart(userStore.cartList);

                      console.log('Update cart res:', response);

                      if (response.statusCode === 200) {
                        Toast.show({
                          type: 'success',
                          text1: 'Thêm vào giỏ hàng thành công',
                          autoHide: true,
                          visibilityTime: 2000,
                          topOffset: 40,
                        });
                      } else {
                        Toast.show({
                          type: 'error',
                          text1: response.message,
                          autoHide: false,
                          topOffset: 40,
                        });
                      }
                    }}>
                    <Text style={styles.buttonText} numberOfLines={2}>
                      Thêm vào giỏ hàng
                    </Text>
                  </TouchableOpacity>
                </>
              )
            ) : (
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <Text style={styles.buttonText} numberOfLines={2}>
                    Mua ngay
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <Text style={styles.buttonText} numberOfLines={2}>
                    Thêm vào giỏ hàng
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Các gói người dùng</Text>
        {/* <TouchableOpacity>
            <Text
              onPress={() => {
                // navigation.navigate(
                //   RouteNames.EDIT_PROFILE as never,
                //   {} as never,
                // );
              }}
              style={styles.subTitle}>
              Xem tất cả
            </Text>
          </TouchableOpacity> */}
      </View>

      <Carousel
        loop={false}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 50,
        }}
        width={width * 0.9}
        height={height * 0.67}
        // autoPlay={true}
        data={packages}
        scrollAnimationDuration={1000}
        onSnapToItem={index => console.log('current index:', index)}
        renderItem={renderItem}
      />

      <Modal isVisible={modalVisible}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: Colors.background.white,
            borderRadius: 10,
            padding: 10,
          }}>
          <TouchableOpacity
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}
            onPress={() => {
              setModalVisible(false);
            }}>
            <Ionicons name="close" color={Colors.text.grey} size={24} />
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'center',
                  color: Colors.text.grey,
                }}>
                Vui lòng{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate(RouteNames.LOGIN, {});
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: 'center',
                    color: Colors.text.orange,
                  }}>
                  đăng nhập/đăng ký
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 18,
                textAlign: 'center',
                color: Colors.text.grey,
              }}>
              để sử dụng chức năng này
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default observer(PackageScreen);
