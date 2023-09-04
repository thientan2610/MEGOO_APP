import {useEffect, useRef, useState} from 'react';
import {
  AppState,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/AntDesign';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';

import {splitString} from '../../../../common/handle.string';
import {ICartList} from '../../../../common/interfaces/package.interface';
import userStore from '../../../../common/store/user.store';
import {Colors} from '../../../../constants/color.const';
import RouteNames from '../../../../constants/route-names.const';
import {updateCart} from '../PackageScreen/services/package.service';
import {getUserCart} from './services/cart.service';
import styles from './styles/style';

const CartScreen = ({navigation}: {navigation: any}) => {
  const [cartList, setCartList] = useState<any[]>([]);
  const [selectedItemList, setSelectedItemList] = useState<any>({
    cart: [],
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemPrice, setItemPrice] = useState(0);

  const [toggleCheckBoxArray, setToggleCheckBoxArray] = useState(
    cartList.map(() => false),
  );

  const [selectedAll, setSelectedAll] = useState(false);

  const appState = useRef(AppState.currentState);

  const getCartList = async () => {
    const cartListRes = await getUserCart();

    // console.log('cartListRes:', cartListRes);

    if (
      !cartListRes.cart ||
      !cartListRes?.cart?.length ||
      cartListRes?.cart?.length === 0
    ) {
      return [];
    } else {
      const newCartList = cartListRes.cart.map((cartItem: any) => {
        return {
          name: cartItem.name,
          package: cartItem._id,
          duration: cartItem.duration,
          noOfMember: cartItem.noOfMember,
          quantity: cartItem.quantity,
          price: cartItem.price,
        };
      });

      return newCartList;
    }
  };

  useEffect(() => {
    getCartList().then(cartList => {
      setCartList(cartList);
      setToggleCheckBoxArray(() => cartList.map(() => false));
    });

    setTimeout(() => {
      console.log('toggleCheckBoxArray:', toggleCheckBoxArray);
    }, 1000);
  }, []);

  useEffect(() => {
    let totalPrice = 0;

    cartList.forEach((item, index) => {
      const itemTotalPrice = item.price * item.quantity;

      if (toggleCheckBoxArray[index] === true) {
        totalPrice += itemTotalPrice;
      }
    });

    setTotalPrice(totalPrice);
  }, [cartList, toggleCheckBoxArray]);

  useEffect(() => {
    console.log('selectedAll:', selectedAll);

    if (selectedAll === true) {
      setToggleCheckBoxArray(() => cartList.map(() => true));

      // Assign all items to selectedItemsList
      setSelectedItemList(() => ({
        cart: cartList.map((item: any) => {
          return {
            package: item.package,
            name: item.name,
            duration: item.duration,
            noOfMember: item.noOfMember,
            quantity: item.quantity,
            price: item.price,
          };
        }),
      }));
    } else {
      setToggleCheckBoxArray(() => cartList.map(() => false));
    }
  }, [selectedAll]);

  // Check if toggleCheckBoxArray is all true then set selectedAll to true
  useEffect(() => {
    const isAllTrue =
      toggleCheckBoxArray.length > 0 &&
      toggleCheckBoxArray.every(item => item === true);
    console.log('toggleCheckBoxArray:', toggleCheckBoxArray);

    console.log('isAllTrue:', isAllTrue);

    if (isAllTrue === true) {
      setSelectedAll(true);
    } else {
      setSelectedAll(false);
    }
  }, [toggleCheckBoxArray]);

  const renderCartItem = () => {
    const handleToggleCheckBox = (
      index: number,
      newValue: boolean,
      object: {
        package: string;
        name: string;
        quantity: number;
        noOfMember: number;
        duration: number;
        price: number;
      },
    ) => {
      const updatedArray = [...toggleCheckBoxArray];
      console.log('updatedArray:', updatedArray);
      updatedArray[index] = newValue;
      console.log('updatedArray:', updatedArray);

      setToggleCheckBoxArray(updatedArray);

      setItemPrice(object.price * object.quantity);

      let cartItem: any = {
        package: object.package,
        name: object.name,
        quantity: object.quantity,
        noOfMember: object.noOfMember,
        duration: object.duration,
        price: object.price * object.quantity,
      };

      console.log('item pkg:', cartItem);
      setSelectedItemList(() => ({
        cart: selectedItemList.cart.map((item: any) => {
          return {
            package: item.package,
            name: item.name,
            duration: item.duration,
            noOfMember: item.noOfMember,
            quantity: item.quantity,
            price: item.price * item.quantity,
          };
        }),
      }));

      if (updatedArray[index] === true) {
        // If the array is empty, add the selected item to the array
        if (selectedItemList.cart.length === 0) {
          setSelectedItemList(() => ({
            cart: [cartItem],
          }));
        } else {
          // If the array is not empty, check if the selected item already exists in the array
          const cartIndex = selectedItemList.cart.findIndex(
            (obj: any) =>
              obj.package === cartItem.package &&
              obj.noOfMember === cartItem.noOfMember &&
              obj.duration === cartItem.duration,
          );

          // If not, add the selected item to the array
          if (cartIndex === -1) {
            setSelectedItemList((prevCartList: any) => ({
              cart: [...prevCartList.cart, cartItem],
            }));
          }
        }

        console.log('selected list:', selectedItemList.cart);

        let price =
          itemPrice + cartList[index].price * cartList[index].quantity;
        setItemPrice(price);
      } else {
        // If the already selected item is deselected, remove it from the array
        const cartIndex = selectedItemList.cart.findIndex(
          (obj: any) =>
            obj.package === cartItem.package &&
            obj.noOfMember === cartItem.noOfMember &&
            obj.duration === cartItem.duration,
        );

        setSelectedItemList((prevState: any) => ({
          ...prevState,
          cart: prevState.cart.filter(
            (item: any, i: number) => i !== cartIndex,
          ),
        }));

        let price =
          itemPrice - cartList[index].price * cartList[index].quantity;
        setItemPrice(price);
      }
    };

    return cartList.map((object: any, index) => {
      return (
        <View style={styles.cartListContainer} key={index}>
          <CheckBox
            style={{
              marginLeft: 5,
            }}
            tintColors={{true: Colors.text.orange}}
            disabled={false}
            value={toggleCheckBoxArray[index]}
            onValueChange={newValue =>
              handleToggleCheckBox(index, newValue, object)
            }
          />
          <View style={styles.cartItemContainer} key={index}>
            <View style={styles.cartInfoContainer}>
              <Text style={styles.text}>Tên gói: </Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {object.name}
              </Text>
            </View>
            <View style={styles.cartInfoContainer}>
              <Text style={styles.text}>Thời hạn:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {object.duration} tháng
              </Text>
            </View>
            <View style={styles.cartInfoContainer}>
              <Text style={styles.text}>Số lượng thành viên:</Text>
              <Text style={[styles.text, {fontWeight: 'bold'}]}>
                {object.noOfMember} người
              </Text>
            </View>
            <View style={styles.cartInfoContainer}>
              <Text style={styles.text}>Số lượng:</Text>
              <NumericInput
                type="plus-minus"
                minValue={1}
                maxValue={50}
                value={object.quantity}
                totalWidth={150}
                totalHeight={35}
                iconStyle={{fontSize: 20, color: Colors.text.white} as any}
                rightButtonBackgroundColor="#32CD32"
                leftButtonBackgroundColor="#FF2400"
                rounded={true}
                textColor={Colors.text.grey}
                inputStyle={{fontSize: 14} as any}
                onChange={(num: number) => {
                  const index = cartList.findIndex(
                    (cartItem: any) =>
                      cartItem.package === object.package &&
                      cartItem.noOfMember === object.noOfMember &&
                      cartItem.duration === object.duration,
                  );

                  // Update item total price
                  if (cartList[index].quantity < num) {
                    let price = itemPrice + cartList[index].price;
                    setItemPrice(price);
                  } else if (cartList[index].quantity > num) {
                    let price = itemPrice - cartList[index].price;
                    setItemPrice(price);
                  }

                  // Update cart item's quantity
                  if (index === -1) {
                    cartList.push({...object, quantity: num});
                  } else {
                    cartList[index].quantity = num;
                  }

                  const payload: ICartList = {
                    cart: cartList.map((cartItem: any) => {
                      return {
                        package: cartItem.package,
                        quantity: cartItem.quantity,
                        noOfMember: cartItem.noOfMember,
                        duration: cartItem.duration,
                      };
                    }),
                  };

                  // Update cart
                  updateCart(payload)
                    .then(async res => {
                      console.log('Update cart after incr:', res.data);
                      const newCartList = await getCartList();
                      setCartList(newCartList);
                      // setSelectedItemList(newCartList);

                      setSelectedItemList(() => ({
                        cart: newCartList.map((item: any) => {
                          return {
                            package: item.package,
                            name: item.name,
                            duration: item.duration,
                            noOfMember: item.noOfMember,
                            quantity: item.quantity,
                            price: item.price * item.quantity,
                          };
                        }),
                      }));
                    })
                    .catch(error => {
                      console.log('update cart err:', error);
                    });
                }}
              />
            </View>
            <View style={styles.cartInfoContainer}>
              <Text style={styles.text}>Giá tiền:</Text>
              <Text
                style={[
                  {color: Colors.text.orange, fontSize: 18, fontWeight: 'bold'},
                ]}>
                {splitString(
                  Math.round(object.price * object.quantity).toString(),
                )}{' '}
                VNĐ
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={styles.cartListContainer}>
        <CheckBox
          style={{
            marginLeft: 5,
          }}
          tintColors={{true: Colors.text.orange}}
          disabled={false}
          value={selectedAll}
          onValueChange={newValue => {
            setSelectedAll(newValue);
          }}
        />
        <Text style={{fontSize: 16, color: Colors.text.grey}}>Chọn tất cả</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {renderCartItem()}
      </ScrollView>

      <View style={styles.paymentButtonContainer}>
        <View style={styles.icon}>
          <Icon name="shoppingcart" size={30} color={Colors.text.orange} />
        </View>
        <Text style={styles.price} numberOfLines={2}>
          {splitString(Math.round(totalPrice).toString())} VNĐ
        </Text>

        <TouchableOpacity
          onPress={async () => {
            const accessToken = await AsyncStorage.getItem('accessToken');
            console.log('AT:', accessToken);
            console.log('User id:', userStore.id);
            console.log('Selected item list:', selectedItemList.cart);

            if (selectedItemList.cart.length === 0) {
              Toast.show({
                type: 'error',
                text1: 'Vui lòng chọn gói để thanh toán',
                autoHide: true,
                visibilityTime: 3000,
                topOffset: 30,
                bottomOffset: 40,
              });
            } else {
              navigation.navigate(RouteNames.PAYMENT as never, {
                totalPrice: totalPrice,
                selectedItems: selectedItemList.cart,
              });
            }
          }}
          style={styles.paymentButton}>
          <Text style={styles.paymentText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
      <Toast position="top"></Toast>
    </View>
  );
};

export default CartScreen;
