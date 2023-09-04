import {useEffect, useMemo, useRef, useState} from 'react';
import {
  AppState,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group';
import Toast from 'react-native-toast-message';

import {RouteProp, useRoute} from '@react-navigation/native';

import {splitString} from '../../../../common/handle.string';
import {ICartList} from '../../../../common/interfaces/package.interface';
import appStore from '../../../../common/store/app.store';
import {Colors} from '../../../../constants/color.const';
import {checkout, getUserById, renew} from './services/payment.service';
import styles from './styles/style';

// Define the type for the route params
type SelectedItemsRouteParams = {
  totalPrice: number;
  selectedItems: [];
};

// Specify the type for the route
type SelectedItemsRouteProp = RouteProp<
  Record<string, SelectedItemsRouteParams>,
  string
>;

const PaymentScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<SelectedItemsRouteProp>();

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'ZALOPAY',
        value: 'ZALOPAY',
        size: 20,
        color: Colors.icon.orange,
        labelStyle: {color: Colors.text.grey},
        image: require('../../../../../assets/ZaloPay-logo.png'),
      },
      {
        id: '2',
        label: 'VNPAY',
        value: 'VNPAY',
        size: 20,
        color: Colors.icon.orange,
        labelStyle: {color: Colors.text.grey},
        uri: require('../../../../../assets/VNPay-logo.png'),
      },
    ],
    [],
  );

  const [selectedId, setSelectedId] = useState<string | undefined>(
    radioButtons[0].id,
  );

  const [selectedItemList, setSelectedItemList] = useState<ICartList>({
    cart: [],
  });
  const [itemsInfo, setItemsInfo] = useState<any>({
    cart: [],
  });
  const [totalPrice, setTotalPrice] = useState('');

  const selectedItems = route.params.selectedItems;

  useEffect(() => {
    console.log('selectedItems: ', selectedItems);

    setItemsInfo(() => ({
      cart: selectedItems.map((item: any) => {
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

    setSelectedItemList(() => ({
      cart: selectedItems.map((item: any) => {
        return {
          package: item.package,
          duration: item.duration,
          noOfMember: item.noOfMember,
          quantity: item.quantity,
        };
      }),
    }));

    setTotalPrice(splitString(route.params.totalPrice.toString()));
  }, []);

  const renderItem = () => {
    return itemsInfo.cart.map((item: any, index: any) => {
      return (
        <View style={styles.packageContainer} key={index}>
          <View style={styles.infoRow}>
            <Text style={styles.text}>Tên gói:</Text>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>{item.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.text}>Thời hạn:</Text>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>
              {item.duration} tháng
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.text}>Số lượng thành viên:</Text>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>
              {item.noOfMember}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.text}>Số lượng gói:</Text>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>
              {item.quantity}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.text}>Thành tiền:</Text>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>
              {splitString(Math.round(item.price).toString())} VNĐ
            </Text>
          </View>
        </View>
      );
    });
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Phương thức thanh toán</Text>
        <RadioGroup
          containerStyle={styles.radioButtonContainer}
          layout="column"
          radioButtons={radioButtons}
          onPress={setSelectedId}
          selectedId={selectedId}
        />
        <View style={styles.itemsContainer}>{renderItem()}</View>
      </ScrollView>

      <View style={styles.paymentContainer}>
        <Text style={styles.priceText}>{totalPrice} VNĐ</Text>
        {appStore.isExtendedPkg === false ? (
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              console.log('route.params:', itemsInfo);
              if (selectedId === '1') {
                console.log('ZALOPAY');

                const response = await checkout(selectedItemList, 'ZALOPAY');
                console.log('Checkout ZALOPAY response:', response);
                const order = response.order;
                const trans = response.trans;
                console.log('order res:', order);
                console.log('trans res:', trans);
                const trans_id = response.trans._id;
                console.log('trans_id', trans_id);

                // Open URL for payment
                Linking.openURL(response.order.order_url);
                // Linking.openURL(response.data);
                let intervalCheckActive = true;
                let interValCheck = setInterval(async () => {
                  if (!intervalCheckActive) {
                    clearInterval(interValCheck);
                    return;
                  }

                  const getRes = await getUserById();
                  console.log('trans id in hist:', getRes.user.trxHist);
                  if (getRes.user.trxHist.includes(trans_id)) {
                    console.log(trans_id, 'exists in trxHist');
                    clearInterval(interValCheck);

                    intervalCheckActive = false;

                    Toast.show({
                      type: 'success',
                      text1: 'Thanh toán thành công',
                      autoHide: true,
                      visibilityTime: 3000,
                      topOffset: 20,
                      onHide: () => {
                        navigation.navigate('PROFILE_STACK', {
                          params: {
                            screen: 'PROFILE',
                            activeTab: 'group',
                          },
                        });
                      },
                    });
                  }
                }, 10 * 1000);

                setTimeout(() => {
                  clearInterval(interValCheck);
                  intervalCheckActive = false;
                }, 2 * 60 * 1000);
              } else if (selectedId === '2') {
                console.log('VNPAY');
                const response = await checkout(selectedItemList, 'VNPAY');
                console.log('Checkout VNPAY response:', response);

                // Open URL for payment
                Linking.openURL(response.data);

                // Toast.show({
                //   type: 'success',
                //   text1: 'Thanh toán thành công',
                //   autoHide: true,
                //   visibilityTime: 3000,
                //   topOffset: 20,
                //   onHide: () => {
                //     navigation.navigate('PROFILE_STACK', {
                //       params: {
                //         screen: 'PROFILE',
                //         activeTab: 'group',
                //       },
                //     });
                //   },
                // });
              }
            }}>
            <Text style={styles.buttonText}>Thanh toán</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              console.log('pkg id:', appStore.renewPkgId);
              console.log('group id:', appStore.renewGroupId);
              // console.log('group duration', appStore.renewPkg.duration);

              const pkg = {
                package: appStore.renewPkg.package,
                noOfMember: appStore.renewPkg.noOfMember,
                duration: appStore.renewPkg.duration,
              };

              const response = await renew(appStore.renewPkg, 'ZALOPAY');
              console.log('Renew res:', response);

              const order = response.order;
              const trans = response.trans;
              console.log('order res:', order);
              console.log('trans res:', trans);
              const trans_id = response.trans._id;
              console.log('trans_id', trans_id);

              // Open URL for payment
              Linking.openURL(response.order.order_url);

              let intervalCheckActive = true;
              let interValCheck = setInterval(async () => {
                if (!intervalCheckActive) {
                  clearInterval(interValCheck);
                  return;
                }

                const getRes = await getUserById();
                console.log('trans id in hist:', getRes.user.trxHist);
                if (getRes.user.trxHist.includes(trans_id)) {
                  console.log(trans_id, 'exists in trxHist');
                  clearInterval(interValCheck);

                  intervalCheckActive = false;
                  appStore.setIsExtendedPkg(false);
                  appStore.setRenewPkg({
                    package: '',
                    noOfMember: 0,
                    duration: 0,
                  });
                }
                if (!intervalCheckActive) {
                  Toast.show({
                    type: 'success',
                    text1: 'Gia hạn thành công',
                    autoHide: true,
                    visibilityTime: 3000,
                    topOffset: 20,
                    onHide: () => {
                      navigation.navigate('PROFILE_STACK', {
                        params: {
                          screen: 'PROFILE',
                          activeTab: 'group',
                        },
                      });
                    },
                  });
                }
              }, 10 * 1000);

              setTimeout(() => {
                clearInterval(interValCheck);
                intervalCheckActive = false;
                appStore.setIsExtendedPkg(false);
                appStore.setRenewPkg({
                  package: '',
                  noOfMember: 0,
                  duration: 0,
                });
              }, 2 * 60 * 1000);
            }}>
            <Text style={styles.buttonText}>Thanh toán</Text>
          </TouchableOpacity>
        )}
      </View>
      <Toast position="top" />
    </>
  );
};

export default PaymentScreen;
