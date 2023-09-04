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
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';

import {splitString} from '../../../../../common/handle.string';
import groupStore from '../../../../../common/store/group.store';
import userStore from '../../../../../common/store/user.store';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {getMembers} from '../../../../../services/group.service';
import {createFund} from './services/create-fund.service';
import styles from './styles/style';

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

const CreateFundScreen = () => {
  const navigation = useNavigation();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);

  const [isFocus, setIsFocus] = useState(false);

  const [times, setTimes] = useState<
    {
      label: string;
      value: string;
    }[]
  >([
    {
      label: '1 tháng',
      value: '1',
    },
    {
      label: '2 tháng',
      value: '2',
    },
    {
      label: '3 tháng',
      value: '3',
    },
    {
      label: '4 tháng',
      value: '4',
    },
    {
      label: '5 tháng',
      value: '5',
    },
    {
      label: '6 tháng',
      value: '6',
    },
    {
      label: '7 tháng',
      value: '7',
    },
    {
      label: '8 tháng',
      value: '8',
    },
    {
      label: '9 tháng',
      value: '9',
    },
    {
      label: '10 tháng',
      value: '10',
    },
    {
      label: '11 tháng',
      value: '11',
    },
    {
      label: '12 tháng',
      value: '12',
    },
  ]);

  const [members, setMembers] = useState<
    {
      role: string;
      id: string;
      name: string;
      email: string;
      avatar: string;
    }[]
  >([]);

  const [toggleCheckBoxArray, setToggleCheckBoxArray] = useState(
    members.map((_, index) => index === 0),
  );

  const [amountArray, setAmountArray] = useState<string[]>([]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleToggleCheckBox = (index: number, newValue: boolean) => {
    const updatedArray = [...toggleCheckBoxArray];
    console.log('updatedArray:', updatedArray);
    updatedArray[index] = newValue;
    console.log('updatedArray:', updatedArray);

    setToggleCheckBoxArray(updatedArray);
  };

  const diviseAmount = (amount: number) => {
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
          id: member?.user?._id,
          name: member?.user?.name,
          avatar: member?.user?.avatar,
          email: member?.user?.email,
        }));

        setMembers(groupMembers);
        // Initialize toggleCheckBoxArray with true for the current user's index, if found
        const currentUserIndex = groupMembers.findIndex(
          (member: any) => member.role === 'Super User',
        );

        const initialToggleValues = groupMembers.map(
          (_: any, index: number) => index === currentUserIndex,
        );
        setToggleCheckBoxArray(initialToggleValues);
        // setAmountArray(Array.from({length: members.length}, () => '0'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMemberList();
  }, []);

  useEffect(() => {
    console.log('amountArray', amountArray);
  }, [amountArray]);

  useEffect(() => {
    console.log('toggleCheckBoxArray', toggleCheckBoxArray);

    const newSelectedMembers = toggleCheckBoxArray
      .map((item, index) =>
        toggleCheckBoxArray[index] ? members[index].id : null,
      )
      .filter(Boolean) as string[];
    console.log('newSelectedMembers', newSelectedMembers);

    setSelectedMembers(newSelectedMembers);
  }, [toggleCheckBoxArray]);

  useEffect(() => {
    if (totalAmount > 0) {
      diviseAmount(totalAmount);
    }
  }, [totalAmount, toggleCheckBoxArray]);

  return (
    <Formik
      initialValues={{
        summary: '',
        description: '',
        times: times[0].value,
        total: '',
        startDate: '',
        ends: '',
      }}
      enableReinitialize
      validationSchema={FundSchema}
      onSubmit={async values => {
        console.log('values', values);
        console.log('members', selectedMembers);

        const fund = {
          summary: values.summary,
          description: values.description,
          times: Number(values.times),
          total: totalAmount,
          startDate: moment(values.startDate, 'DD/MM/YYYY').toISOString(),
          ends: moment(values.ends, 'DD/MM/YYYY').toISOString(),
          members: selectedMembers,
        };
        console.log('fund', fund);

        const response = await createFund(groupStore.id, fund);
        console.log('response', response.statusCode);

        if (response.statusCode === 201) {
          Toast.show({
            type: 'success',
            text1: `${response.message}`,
            autoHide: true,
            visibilityTime: 1000,
            onHide: () => {
              navigation.goBack();
            },
          });
        } else {
          Toast.show({
            type: 'error',
            text1: `${response.message}`,
            autoHide: true,
            visibilityTime: 3000,
          });
        }
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
              onConfirm={value => {
                console.log('Selected start date:', value);

                setOpenStartDatePicker(false);
                setStartDate(value);
                setFieldValue('startDate', moment(value).format('DD/MM/YYYY'));

                console.log('Values startDate', values.startDate);
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
              onConfirm={value => {
                console.log('Selected end date:', value);

                setOpenEndDatePicker(false);
                setEndDate(value);
                setFieldValue('ends', moment(value).format('DD/MM/YYYY'));
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
            {/* <Dropdown
              style={{
                width: '40%',
                height: 40,
                marginBottom: 10,
                marginHorizontal: 10,
                // backgroundColor: 'yellow',
              }}
              data={times}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Chọn kỳ hạn' : '...'}
              placeholderStyle={{
                color: Colors.text.lightgrey,
              }}
              itemTextStyle={{
                color: Colors.text.grey,
              }}
              selectedTextStyle={{
                color: Colors.text.grey,
                fontWeight: 'bold',
                fontSize: 14,
              }}
              value={values.times}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setFieldValue('times', item.value);
              }}
            /> */}
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
                key={member.id}>
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
                    disabled={member.role === 'Super User'}
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

          <Text style={styles.title}>Mô tả</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('description', value)}
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
            style={[
              styles.createButton,
              {
                backgroundColor: isValid
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.lightorange,
              },
            ]}
            disabled={!isValid}
            onPress={handleSubmit}>
            <Text style={styles.buttonText}>Tạo</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </Formik>
  );
};

export default CreateFundScreen;
