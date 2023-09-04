import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown} from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {ProgressView} from '@react-native-community/progress-view';
import {RouteProp, useRoute} from '@react-navigation/native';

import {IMAGE_URI_DEFAULT} from '../../../../../common/default';
import {
  changeBillStatusToVietnamese,
  dateFormat,
  dateISOFormat,
  splitString,
} from '../../../../../common/handle.string';
import userStore from '../../../../../common/store/user.store';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {
  deleteBill,
  getBillInfo,
  sendRequest,
  updateBillInfo,
  updateBorrowersStatusByLender,
  updateBorrowerStatus,
} from './services/bill-info-service';
import styles from './styles/style';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Define the type for the route params
type BillRouteParams = {
  billId: string;
};

// Specify the type for the route
type BillRouteProp = RouteProp<Record<string, BillRouteParams>, string>;

const BillInfoScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<BillRouteProp>();
  const billId = route.params.billId;

  const [modalVisible, setModalVisible] = useState(false);

  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');

  const [borrowersStatus, setBorrowersStatus] = useState<string[]>([]);
  const [lenderStatus, setLenderStatus] = useState<string[]>([]);
  const [status, setStatus] = useState([
    {label: 'Chờ thanh toán', value: 'PENDING'},
    {label: 'Đã xác nhận', value: 'APPROVED'},
    {label: 'Hủy', value: 'CANCELED'},
  ]);

  const [dropdownStates, setDropdownStates] = useState<boolean[]>([]);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(status[0].value);
  const [bill, setBill] = useState({
    _id: '',
    summary: '',
    description: '',
    date: '',
    lender: {
      _id: '',
      name: '',
      email: '',
      avatar: '',
    },
    borrowers: [
      {
        borrower: {
          _id: '',
          name: '',
          email: '',
          avatar: '',
        },
        amount: '',
        status: '',
      },
    ],
  });

  const getBill = async () => {
    const bill = await getBillInfo(billId);
    // console.log('bill', JSON.stringify(bill, null, 2));
    console.log('bill id', bill?.billing?._id);
    setBill({
      _id: bill?.billing?._id ?? '',
      summary: bill?.billing?.summary ?? '',
      description: bill?.billing?.description ?? '',
      date: dateFormat(bill?.billing?.date) ?? '',
      lender: {
        _id: bill?.billing?.lender?._id ?? '',
        name: bill?.billing?.lender?.name ?? '',
        email: bill?.billing?.lender?.email ?? '',
        avatar: bill?.billing?.lender?.avatar ?? '',
      },

      borrowers: bill?.billing?.borrowers.map((borrower: any) => {
        return {
          borrower: {
            _id: borrower?.borrower?._id ?? '',
            name: borrower?.borrower?.name ?? '',
            email: borrower?.borrower?.email ?? '',
            avatar: borrower?.borrower?.avatar ?? '',
          },
          amount: borrower?.amount ?? '',
          status: borrower?.status ?? '',
          detailStt: {
            lender: borrower?.detailStt?.lender,
            borrower: borrower?.detailStt?.borrower,
          },
        };
      }),
    });

    setSummary(bill?.billing?.summary ?? '');
    setDescription(bill?.billing?.description ?? '');
    setBorrowersStatus(
      bill?.billing?.borrowers.map((borrower: any) => borrower.status),
    );
    // setLenderStatus(
    //   bill?.billing?.borrowers.map(
    //     (borrower: any) => borrower.detailStt.lender,
    //   ),
    // );
    setDropdownStates(bill?.billing?.borrowers.map((borrower: any) => false));
  };

  const updateStatusByLender = async (
    borrowers: {user: string; status: string}[],
  ) => {
    console.log('borrowers:', JSON.stringify(borrowers, null, 2));
    const response = await updateBorrowersStatusByLender(billId, borrowers);
    console.log('response', response);
  };

  const updateStatusByBorrower = async (status: string) => {
    console.log('status:', status);
    const response = await updateBorrowerStatus(billId, status);
    console.log('response', response);
  };

  useEffect(() => {
    console.log('billId:', route.params.billId);
    getBill();
  }, []);

  useEffect(() => {
    // console.log('bill:', JSON.stringify(bill, null, 2));
    console.log(
      bill.borrowers.map((borrower: any) => {
        return {
          borrower: borrower.borrower._id,
          amount: borrower.amount,
        };
      }),
    );
  }, [summary]);

  useEffect(() => {
    console.log('borrowerStatus:', borrowersStatus);

    borrowersStatus.map((status: string, index) => {
      if (status !== bill.borrowers[index].status) {
        console.log(status, bill.borrowers[index].status);
        if (userStore.id === bill.lender._id) {
          console.log('Lender changes status');

          const borrowers = [
            {
              user: bill.borrowers[index].borrower._id,
              status: status,
            },
          ];
          updateStatusByLender(borrowers);
        } else if (userStore.id === bill.borrowers[index].borrower._id) {
          console.log('borrower changes status');

          updateStatusByBorrower(status);
        }
      }
    });
  }, [borrowersStatus]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={text => setSummary(text)}
          onEndEditing={async () => {
            const borrowers = bill.borrowers.map((borrower: any) => {
              return {
                borrower: borrower.borrower._id,
                amount: borrower.amount,
              };
            });
            const response = await updateBillInfo(billId, {
              summary: summary,
              date: dateISOFormat(bill.date),
              lender: bill.lender._id,
              description: bill.description,
              borrowers: borrowers,
            });

            console.log('Update summary:', response);
          }}
          value={summary}
          style={[styles.inputText, {fontSize: 20, fontWeight: 'bold'}]}
          placeholder={'Tên khoản chi tiêu'}
          placeholderTextColor={Colors.text.lightgrey}
        />
      </View>

      <Text style={styles.title}>Mô tả</Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={text => setDescription(text)}
          onEndEditing={async () => {
            const borrowers = bill.borrowers.map((borrower: any) => {
              return {
                borrower: borrower.borrower._id,
                amount: borrower.amount,
              };
            });

            const ob = {
              summary: bill.summary,
              date: dateISOFormat(bill.date),
              lender: bill.lender._id,
              description: description,
              borrowers: borrowers,
            };

            console.log('ob', JSON.stringify(ob, null, 2));

            // const response = await updateBillInfo(billId, {
            //   summary: bill.summary,
            //   date: dateISOFormat(bill.date),
            //   lender: bill.lender._id,
            //   description: description,
            //   borrowers: borrowers,
            // });

            // console.log('Update summary:', response);
          }}
          value={description}
          style={styles.inputText}
          // multiline={true}
          maxLength={100}
          placeholder={'Mô tả'}
          placeholderTextColor={Colors.text.lightgrey}
        />
      </View>

      <Text style={styles.title}>Người cho mượn</Text>
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.lenderContainer,
            userStore.id !== bill.lender._id
              ? {
                  justifyContent: 'space-between',
                }
              : {},
          ]}>
          <Image
            source={{uri: bill?.lender?.avatar || IMAGE_URI_DEFAULT}}
            style={styles.avatar}
          />
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Họ và tên:</Text>
              <Text style={styles.text}>{bill.lender.name}</Text>
            </View>
          </View>
          {userStore.id !== bill.lender._id && (
            <TouchableOpacity
              onPress={async () => {
                const response = await sendRequest(billId, bill.lender._id);
                console.log(
                  `Borrower send req to ${bill.lender._id}:`,
                  response,
                );

                if (response.statusCode === 200) {
                  Toast.show({
                    type: 'success',
                    text1: `Gửi nhắc nhở đến ${bill.lender.name} thành công`,
                    autoHide: true,
                    visibilityTime: 1000,
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: `Gửi nhắc nhở đến ${bill.lender.name} thất bại`,
                    autoHide: true,
                    visibilityTime: 1000,
                  });
                }
              }}>
              <Ionicons
                name="notifications"
                size={24}
                color={Colors.icon.orange}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* <Text style={styles.title}>Tiến độ</Text>
      <View style={styles.contentContainer}>
        <ProgressView
          progressTintColor="pink"
          trackTintColor="blue"
          progress={0.7}
          style={{width: '100%', alignSelf: 'center'}}
        />
      </View> */}

      <Text style={styles.title}>Danh sách người mượn</Text>
      <View style={styles.contentContainer}>
        {bill.borrowers.map((borrower, index) => {
          const borrowerViStatus = changeBillStatusToVietnamese(
            borrower.status,
          );

          return (
            <View
              key={index}
              style={[styles.borrowerContainer, {zIndex: 10000 - index}]}>
              <View
                style={[
                  {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',

                    gap: 10,
                  },
                  userStore.id === bill.lender._id
                    ? {
                        justifyContent: 'space-between',
                      }
                    : {},
                ]}>
                <Image
                  source={{
                    uri: borrower?.borrower?.avatar || IMAGE_URI_DEFAULT,
                  }}
                  style={styles.avatar}
                />
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Họ và tên:</Text>
                    <Text style={styles.text}>{borrower.borrower.name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Số tiền:</Text>
                    <Text style={styles.text}>
                      {splitString(borrower.amount.toString())} VNĐ
                    </Text>
                  </View>
                  <View style={[styles.infoRow, {alignItems: 'center'}]}>
                    <Text style={styles.labelText}>Trạng thái:</Text>
                    {userStore.id === bill.lender._id ? (
                      <Dropdown
                        style={{
                          width: '60%',
                        }}
                        data={status}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Chọn người cho mượn' : '...'}
                        placeholderStyle={{
                          color: Colors.text.lightgrey,
                        }}
                        value={borrowersStatus[index]}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          // setValue(item.value);

                          const newStatus = [...borrowersStatus];
                          newStatus[index] = item.value;
                          setBorrowersStatus(newStatus);
                        }}
                      />
                    ) : (
                      <Text style={styles.text}>{borrowerViStatus}</Text>
                    )}
                  </View>
                  {/* {borrower.status === 'PENDING' ? (
                    <Text style={{color: Colors.text.red}}>
                      &#8251; Chờ người cho mượn xác nhận
                    </Text>
                  ) : (
                    false
                  )} */}
                </View>
                {userStore.id === bill.lender._id && (
                  <TouchableOpacity
                    onPress={async () => {
                      const response = await sendRequest(
                        billId,
                        borrower.borrower._id,
                      );
                      console.log(
                        `Lender send req to ${borrower.borrower._id}:`,
                        response,
                      );

                      if (response.statusCode === 200) {
                        Toast.show({
                          type: 'success',
                          text1: `Gửi nhắc nhở đến ${borrower.borrower.name} thành công`,
                          autoHide: true,
                          visibilityTime: 1000,
                        });
                      } else {
                        Toast.show({
                          type: 'error',
                          text1: `Gửi nhắc nhở đến ${borrower.borrower.name} thất bại`,
                          autoHide: true,
                          visibilityTime: 1000,
                        });
                      }
                    }}>
                    <Ionicons
                      name="notifications"
                      size={24}
                      color={Colors.icon.orange}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          console.log('billId', billId);
          setModalVisible(true);
        }}>
        <Text style={styles.buttonText}>Xóa</Text>
      </TouchableOpacity>

      <Modal isVisible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Xóa khoản chi tiêu này?</Text>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              style={{
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16, color: Colors.text.orange}}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setModalVisible(!modalVisible);
                const response = await deleteBill(billId);

                if (response.statusCode === 200) {
                  Toast.show({
                    type: 'success',
                    text1: 'Xóa khoản chỉ tiêu thành công',
                    autoHide: true,
                    visibilityTime: 1000,
                    onHide: () => {
                      navigation.navigate(RouteNames.BILL_MANAGEMENT);
                    },
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: response.message,
                    autoHide: false,
                    topOffset: 30,
                  });
                }
              }}
              style={{
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16, color: 'red'}}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* <Toast position="top" /> */}
    </ScrollView>
  );
};

export default BillInfoScreen;
