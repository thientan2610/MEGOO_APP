import {Formik} from 'formik';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import CheckBox from '@react-native-community/checkbox';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {
  dateFormat,
  dateISOFormat,
  splitString,
} from '../../../../../common/handle.string';
import groupStore from '../../../../../common/store/group.store';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {getMembers} from '../../../../../services/group.service';
import {getFundById, updateFundDetail} from './services/fund.service';
import styles from './styles/style';

type FundRouteParams = {
  fundId: string;
};

const FundSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tên quỹ'),
  startDate: Yup.string().required('Vui lòng chọn ngày bắt đầu'),
  times: Yup.string()
    .required('Vui lòng nhập chu kỳ nhắc nhở')
    .min(1, 'Chu kỳ nhắc nhở tối thiểu là 1 tháng')
    .max(12, 'Chu kỳ nhắc nhở tối đa là 12 tháng'),
  total: Yup.string().required('Vui lòng nhập tổng tiền'),
  // members: Yup.array().required('Vui lòng chọn thành viên'),
});

// Specify the type for the route
type FundRouteProp = RouteProp<Record<string, FundRouteParams>, string>;

const FundDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<FundRouteProp>();
  const fundId = route.params.fundId;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [members, setMembers] = useState<
    {
      role: string;
      _id: string;
      name: string;
      email: string;
      avatar: string;
    }[]
  >([]);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const [fund, setFund] = useState<{
    _id: string;
    createdAt: string;
    description: string;
    ends: string;
    history: any[];
    members: {
      _id: string;
      email: string;
      name: string;
      avatar: string;
    }[];
    startDate: string;
    summary: string;
    times: number;
    total: number;
    updatedAt: string;
  }>({
    _id: '',
    createdAt: '',
    description: '',
    ends: '',
    history: [],
    members: [],
    startDate: '',
    summary: '',
    times: 0,
    total: 0,
    updatedAt: '',
  });

  const [toggleCheckBoxArray, setToggleCheckBoxArray] = useState(
    fund.members.map((_, index) => index === 0),
  );

  const [amountArray, setAmountArray] = useState<string[]>([]);

  const [totalAmount, setTotalAmount] = useState(0);

  const handleToggleCheckBox = (index: number, newValue: boolean) => {
    const updatedArray = [...toggleCheckBoxArray];
    console.log('updatedArray:', updatedArray);
    updatedArray[index] = newValue;
    console.log('updatedArray:', updatedArray);

    setToggleCheckBoxArray(updatedArray);
  };

  const diviseAmount = (amount: number) => {
    console.log('amount to divise:', amount);

    // Count in toggleCheckBoxArray how many element have true value
    let count = 0;
    for (let i = 0; i < toggleCheckBoxArray.length; ++i) {
      if (toggleCheckBoxArray[i]) {
        count++;
      }
    }

    console.log('count:', count);

    const result = amount / count;
    console.log('result:', result);

    const updatedArray: string[] = [];
    console.log('updatedAmountArray:', updatedArray);
    for (let i = 0; i < count; ++i) {
      updatedArray.push(splitString(result.toString()));
    }
    console.log('updatedAmountArray:', updatedArray);
    setAmountArray(updatedArray);
    // add result to amount
  };

  const getMemberList = async () => {
    try {
      const response = await getMembers(groupStore.id);
      // console.log(
      //   'Members response:',
      //   JSON.stringify(response.group.members, null, 2),
      //   // response.group.members,
      // );
      if (
        !response.group ||
        !response?.group?.members ||
        response?.group?.members?.length === 0
      ) {
        setMembers([]);
      } else {
        const groupMembers = response?.group?.members?.map((member: any) => ({
          role: member?.role,
          _id: member?.user?._id,
          name: member?.user?.name,
          avatar: member?.user?.avatar,
          email: member?.user?.email,
        }));

        setMembers(groupMembers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (fund.members.length > 0 && members.length > 0) {
      // Initialize toggleCheckBoxArray with true for all the user have id who exist in fund.members array with length = members.length
      setToggleCheckBoxArray(fund.members.map((_, index) => true));
    }
  }, [fund, members]);

  const getFundDetail = async () => {
    try {
      const response = await getFundById(fundId);
      console.log('Get fund response', response);

      if (!response?.funding) {
        return;
      } else {
        setFund({
          _id: response?.funding?._id,
          createdAt: response?.funding?.createdAt,
          description: response?.funding?.description,
          ends: dateFormat(response?.funding?.ends as string),
          history: response?.funding?.history,
          members: response?.funding?.members?.map((member: any) => ({
            _id: member?._id,
            email: member?.email,
            name: member?.name,
            avatar: member?.avatar,
          })),
          startDate: dateFormat(response?.funding?.startDate as string),
          summary: response?.funding?.summary,
          times: response?.funding?.times,
          total: response?.funding?.total,
          updatedAt: response?.funding?.updatedAt,
        });
      }
      setTotalAmount(response?.funding?.total as number);
      // diviseAmount(response?.funding?.total as number);
      setStartDate(new Date(response?.funding?.startDate as string));
      setEndDate(new Date(response?.funding?.ends as string));
    } catch (error) {
      console.log('Get fun by id error: ', error);
    }
  };

  const updateFund = async (fund: {
    summary: string;
    description: string;
    times: number;
    total: number;
    startDate: string;
    ends: string;
    members: string[];
  }) => {
    try {
      const response = await updateFundDetail(fundId, fund);
      console.log('response', response);

      if (response?.statusCode === 200) {
        getFundDetail();
      } else {
        return;
      }
    } catch (error) {
      console.log('Update fund error: ', error);
    }
  };

  // Get fund detail and group's members
  useEffect(() => {
    console.log('Fund id', fundId);
    getFundDetail();
    getMemberList();
  }, []);

  useEffect(() => {
    console.log('amountArray', amountArray);
  }, [amountArray]);

  useEffect(() => {
    console.log('fund members', fund?.members?.[0]);
  }, [fund]);

  // Add new selected member to selectedMembers array
  useEffect(() => {
    console.log('toggleCheckBoxArray', toggleCheckBoxArray);

    const newSelectedMembers = toggleCheckBoxArray
      .map((item, index) =>
        toggleCheckBoxArray[index] ? members[index]?._id : null,
      )
      .filter(Boolean) as string[];
    console.log('newSelectedMembers:', newSelectedMembers);

    //add new selected members to selectedMembers without unchange the old value
    setSelectedMembers([
      ...new Set([...selectedMembers, ...newSelectedMembers]),
    ]);
  }, [toggleCheckBoxArray]);

  // Divide the total amount equally among the selected members of the group
  useEffect(() => {
    if (totalAmount > 0) {
      console.log('totalAmount after get amount', totalAmount);
      diviseAmount(totalAmount);
    }
  }, [totalAmount, toggleCheckBoxArray]);

  useEffect(() => {
    if (selectedMembers.length > 0) {
      console.log('selectedMembers', selectedMembers);
    }
  }, [toggleCheckBoxArray, selectedMembers]);
  return (
    <Formik
      initialValues={{
        summary: fund.summary,
        description: fund.description,
        times: fund.times.toString(),
        total: fund.total.toString(),
        startDate: fund.startDate,
        ends: fund.ends,
      }}
      enableReinitialize
      validationSchema={FundSchema}
      onSubmit={async values => {
        console.log('values', values);
      }}>
      {({
        values,
        touched,
        errors,
        isValid,
        setFieldTouched,
        setFieldValue,
        handleChange,
        handleSubmit,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, {marginTop: 10}]}>Tiêu đề</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('summary', value)}
              onEndEditing={async () => {
                const newFund = {
                  summary: values.summary,
                  description: fund.description,
                  times: fund.times,
                  total: totalAmount,
                  startDate: dateISOFormat(fund.startDate),
                  ends: dateISOFormat(fund.ends),
                  members: selectedMembers,
                };

                console.log('newFund', newFund);

                await updateFund(newFund);
              }}
              onBlur={() => setFieldTouched('summary')}
              style={styles.inputText}
              placeholder={'Nhập tiêu đề'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.summary}
            />
            {values.summary && (
              <Ionicons
                onPress={() => setFieldValue('summary', '')}
                name={'close'}
                style={styles.inputIcon}
              />
            )}
          </View>
          {touched.summary && errors.summary && (
            <Text style={styles.error}>{errors.summary}</Text>
          )}

          <Text style={styles.title}>Ngày bắt đầu</Text>
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              // onChangeText={value => setFieldValue('startDate', value)}
              // onBlur={() => setFieldTouched('startDate')}
              style={styles.inputText}
              placeholder={'Chọn ngày bắt đầu'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.startDate}
            />

            <DatePicker
              modal
              open={openStartDatePicker}
              date={startDate}
              mode={'date'}
              locale={'vi'}
              title={'Chọn ngày'}
              confirmText={'Chọn'}
              cancelText={'Huỷ'}
              onConfirm={async value => {
                console.log('Selected start date:', value);

                setOpenStartDatePicker(false);
                setStartDate(value);
                setFieldValue('startDate', moment(value).format('DD/MM/YYYY'));

                const newFund = {
                  summary: fund.summary,
                  description: fund.description,
                  times: parseInt(values.times),
                  total: totalAmount,
                  startDate: value.toISOString(),
                  ends: dateISOFormat(fund.ends),
                  members: selectedMembers,
                };

                console.log('newFund', newFund);

                await updateFund(newFund);
              }}
              onCancel={() => {
                setOpenStartDatePicker(false);
              }}
            />
            {values.startDate && (
              <Ionicons
                onPress={() => setFieldValue('startDate', '')}
                name={'close'}
                style={[styles.inputIcon, {marginRight: 5}]}
              />
            )}

            <Ionicons
              onPress={() => {
                setOpenStartDatePicker(true);
              }}
              name={'calendar'}
              style={styles.inputIcon}
            />
          </View>
          {touched.startDate && errors.startDate && (
            <Text style={styles.error}>{errors.startDate}</Text>
          )}

          <Text style={styles.title}>Ngày kết thúc</Text>
          <View style={styles.inputContainer}>
            <TextInput
              editable={false}
              // onChangeText={value => setFieldValue('ends', value)}
              // onBlur={() => setFieldTouched('ends')}
              style={styles.inputText}
              placeholder={'Chọn ngày kết thúc'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.ends}
            />

            <DatePicker
              modal
              open={openEndDatePicker}
              date={endDate}
              mode={'date'}
              locale={'vi'}
              title={'Chọn ngày'}
              confirmText={'Chọn'}
              cancelText={'Huỷ'}
              onConfirm={async value => {
                console.log('Selected end date:', value);

                setOpenEndDatePicker(false);
                setEndDate(value);
                setFieldValue('ends', moment(value).format('DD/MM/YYYY'));

                const newFund = {
                  summary: fund.summary,
                  description: fund.description,
                  times: parseInt(values.times),
                  total: totalAmount,
                  startDate: dateISOFormat(fund.startDate),
                  ends: value.toISOString(),
                  members: selectedMembers,
                };

                console.log('newFund', newFund);

                await updateFund(newFund);
              }}
              onCancel={() => {
                setOpenEndDatePicker(false);
              }}
            />
            {values.ends && (
              <Ionicons
                onPress={() => setFieldValue('ends', '')}
                name={'close'}
                style={[styles.inputIcon, {marginRight: 5}]}
              />
            )}

            <Ionicons
              onPress={() => {
                setOpenEndDatePicker(true);
              }}
              name={'calendar'}
              style={styles.inputIcon}
            />
          </View>

          <Text style={styles.title}>Nhắc nhở</Text>
          <View
            style={{
              width: '90%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Nhắc nhở lại sau</Text>
            <View
              style={[
                styles.inputContainer,
                {
                  width: '25%',
                  marginHorizontal: 5,
                  paddingBottom: 0,
                },
              ]}>
              <TextInput
                onChangeText={value => setFieldValue('times', value)}
                onEndEditing={async () => {
                  const newFund = {
                    summary: fund.summary,
                    description: fund.description,
                    times: parseInt(values.times),
                    total: totalAmount,
                    startDate: dateISOFormat(fund.startDate),
                    ends: dateISOFormat(fund.ends),
                    members: selectedMembers,
                  };

                  console.log('newFund', newFund);

                  await updateFund(newFund);
                }}
                onBlur={() => setFieldTouched('times')}
                style={[
                  styles.inputText,
                  {textAlignVertical: 'bottom', textAlign: 'center'},
                ]}
                placeholder={'Nhập chu kỳ'}
                placeholderTextColor={Colors.text.lightgrey}
                value={splitString(values.times)}
                keyboardType={'numeric'}
              />

              {/* {values.times && (
                <Ionicons
                  onPress={() => setFieldValue('times', '')}
                  name={'close'}
                  style={[styles.inputIcon, {marginRight: 5}]}
                />
              )} */}
            </View>
            <Text style={styles.text}>tháng</Text>
          </View>
          {touched.times && errors.times && (
            <Text style={styles.error}>{errors.times}</Text>
          )}

          <Text style={styles.title}>Tổng tiền</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => {
                setFieldValue('total', value);
                const amount = value.split('.').join('');
                console.log('amount:', amount);

                setTotalAmount(parseInt(amount));
              }}
              onEndEditing={async () => {
                const newFund = {
                  summary: fund.summary,
                  description: fund.description,
                  times: fund.times,
                  total: totalAmount,
                  startDate: dateISOFormat(fund.startDate),
                  ends: dateISOFormat(fund.ends),
                  members: selectedMembers,
                };

                console.log('newFund', newFund);

                await updateFund(newFund);
              }}
              onBlur={() => setFieldTouched('total')}
              style={styles.inputText}
              placeholder={'Nhập tổng tiền'}
              placeholderTextColor={Colors.text.lightgrey}
              value={splitString(values.total)}
              keyboardType={'numeric'}
            />
            {values.total && (
              <Ionicons
                onPress={() => setFieldValue('total', '')}
                name={'close'}
                style={[styles.inputIcon, {marginRight: 5}]}
              />
            )}
            <Text style={styles.text}>VNĐ</Text>
          </View>
          {touched.total && errors.total && (
            <Text style={styles.error}>{errors.total}</Text>
          )}

          <Text style={styles.title}>Danh sách thành viên</Text>

          {members.length > 0 &&
            members.map((member, index) => (
              <View
                style={{
                  width: '90%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                key={member._id}>
                <View
                  style={{
                    width: '70%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: -5,
                    gap: 10,
                    marginBottom: 10,
                  }}>
                  <CheckBox
                    tintColors={{true: Colors.checkBox.orange}}
                    // disabled={member._id === 'Super User'}
                    disabled={false}
                    value={toggleCheckBoxArray[index]}
                    onValueChange={async newValue => {
                      handleToggleCheckBox(index, newValue);

                      console.log(newValue);
                    }}
                    style={{width: '10%'}}
                  />
                  <Text style={{color: Colors.text.grey}}>{member.name}</Text>
                </View>

                {toggleCheckBoxArray[index] && amountArray[index] !== '' && (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline',
                      gap: 5,
                    }}>
                    <Text
                      style={{
                        color: Colors.text.grey,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {amountArray[index]}
                    </Text>
                    <Text>VNĐ</Text>
                  </View>
                )}
              </View>
            ))}
          {toggleCheckBoxArray.every(item => !item) && (
            <Text style={styles.error}>Vui lòng chọn thành viên</Text>
          )}

          <Text style={styles.title}>Mô tả</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('description', value)}
              onEndEditing={async () => {
                const newFund = {
                  summary: fund.summary,
                  description: values.description,
                  times: fund.times,
                  total: totalAmount,
                  startDate: dateISOFormat(fund.startDate),
                  ends: dateISOFormat(fund.ends),
                  members: selectedMembers,
                };

                console.log('newFund', newFund);

                await updateFund(newFund);
              }}
              onBlur={() => setFieldTouched('description')}
              style={styles.inputText}
              placeholder={'Nhập mô tả'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.description}
            />
            {values.description && (
              <Ionicons
                onPress={() => setFieldValue('description', '')}
                name={'close'}
                style={styles.inputIcon}
              />
            )}
          </View>

          <TouchableOpacity
            style={[styles.deleteButton]}
            onPress={() => setIsDeleteModalVisible(true)}>
            <Text style={styles.buttonText}>Xóa</Text>
          </TouchableOpacity>

          <Modal isVisible={isDeleteModalVisible}>
            <View style={styles.modalContentContainer}>
              <Text style={styles.modalTitle}>Xóa quỹ {fund.summary}?</Text>

              <View style={styles.modalTextContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsDeleteModalVisible(!isDeleteModalVisible);
                  }}
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: Colors.text.orange}}>
                    Huỷ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    setIsDeleteModalVisible(!isDeleteModalVisible);
                  }}
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: 'red'}}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}
    </Formik>
  );
};

export default FundDetailScreen;
