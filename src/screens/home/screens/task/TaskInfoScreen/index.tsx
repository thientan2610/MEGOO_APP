import {Formik} from 'formik';
import _ from 'lodash';
import moment from 'moment';
import {useEffect, useMemo, useState} from 'react';
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
import {ButtonGroup} from 'react-native-elements';
import Modal from 'react-native-modal';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group';
import Toast from 'react-native-toast-message';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import {RouteProp, useRoute} from '@react-navigation/native';

import {
  convertDayNumberToDayText,
  convertDayTextToDayNumber,
  dateFormat,
  dateFormatWithTime,
  dateISOFormat,
} from '../../../../../common/handle.string';
import {Colors} from '../../../../../constants/color.const';
import {deleteTask, editTaskDetail, getTaskById} from './services/task.service';
import {getMembers} from '../../../../../services/group.service';
import groupStore from '../../../../../common/store/group.store';
import CheckBox from '@react-native-community/checkbox';

type TaskRouteParams = {
  taskId: string;
};

// Specify the type for the route
type TaskRouteProp = RouteProp<Record<string, TaskRouteParams>, string>;

const TaskSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tiêu đề'),
  startDate: Yup.string().required('Vui lòng chọn ngày bắt đầu'),
});

const TaskDetailScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<TaskRouteProp>();
  const taskId = route.params.taskId;
  const [isMounted, setIsMounted] = useState(false);

  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');

  const [startDatetime, setStartDatetime] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(startDate);
  const [openStartDate, setOpenStartDate] = useState(false);

  const [endDatetime, setEndDatetime] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(endDate);
  const [openEndDate, setOpenEndDate] = useState(false);

  const [state, setState] = useState(false);
  const [recurrenceOptions, setRecurrenceOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([
    {
      label: 'Không lặp lại',
      value: 'Does not repeat',
    },
    // {
    //   label: 'Hằng ngày',
    //   value: 'Daily',
    // },
    {
      label: 'Tùy chỉnh',
      value: 'Custom',
    },
  ]);
  const [units, setUnits] = useState<
    {
      label: string;
      value: string;
    }[]
  >([
    {
      label: 'ngày',
      value: 'Day',
    },
    {
      label: 'tuần',
      value: 'Week',
    },
    {
      label: 'tháng',
      value: 'Month',
    },
    {
      label: 'năm',
      value: 'Year',
    },
  ]);
  const [selectedRecurrenceValue, setSelectedRecurrenceValue] = useState(
    recurrenceOptions[0].value,
  );
  const [isRecurrenceFocus, setIsRecurrenceFocus] = useState(false);

  const [times, setTimes] = useState('1');

  const [selectedUnit, setSelectedUnit] = useState(units[1].value);
  const [isUnitFocus, setIsUnitFocus] = useState(false);

  const [repeatOn, setRepeatOn] = useState<string[]>([]);

  const buttons: string[] = ['2', '3', '4', '5', '6', '7', 'CN'];
  const [selectedButtons, setSelectedButtons] = useState<number[]>([0]);

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Không bao giờ',
        value: 'never',
        size: 20,
        color: Colors.icon.orange,
        labelStyle: {color: Colors.text.grey},
      },
      {
        id: '2',
        label: 'Vào ngày',
        value: 'on',
        size: 20,
        color: Colors.icon.orange,
        labelStyle: {color: Colors.text.grey},
      },
    ],
    [],
  );
  const [selectedId, setSelectedId] = useState<string | undefined>(
    radioButtons[0].id,
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [task, setTask] = useState<{
    _id: string;
    summary: string;
    description: string;
    isRepeated: boolean;
    recurrence?: {
      times: number;
      unit: string;
      repeatOn: string[];
      ends?: string;
    };
    startDate: string;
    state: string;
    members?: {
      _id: string;
      name: string;
      avatar: string;
      email: string;
    }[];
    createdBy: {
      _id: string;
      name: string;
      avatar: string;
      email: string;
    };
  }>({
    _id: '',
    summary: '',
    description: '',
    isRepeated: false,
    recurrence: undefined,
    startDate: '',
    state: '',
    members: undefined,
    createdBy: {
      _id: '',
      name: '',
      avatar: '',
      email: '',
    },
  });

  const [newTaskDetail, setNewTaskDetail] = useState<{
    summary: string;
    description: string;
    isRepeated: boolean;
    members?: string[];
    recurrence?: {
      times: number;
      unit: string;
      repeatOn?: string[];
      ends?: string;
    };
    startDate: string;
  }>({
    summary: '',
    description: '',
    isRepeated: false,
    members: [],
    recurrence: {
      times: 1,
      unit: 'Day',
      repeatOn: [],
      ends: '',
    },
    startDate: '',
  });

  const [recurrence, setRecurrence] = useState<{
    times: number;
    unit: string;
    repeatOn?: string[];
    ends?: string;
  }>({
    times: 1,
    unit: 'Day',
    repeatOn: [],
    ends: '',
  });

  const [members, setMembers] = useState<
    {
      role: string;
      _id: string;
      name: string;
      email: string;
      avatar: string;
    }[]
  >([]);

  const [toggleCheckBoxArray, setToggleCheckBoxArray] = useState(
    members.map((_, index) => index === 0),
  );

  const handleToggleCheckBox = (index: number, newValue: boolean) => {
    const updatedArray = [...toggleCheckBoxArray];
    console.log('updatedArray:', updatedArray);
    updatedArray[index] = newValue;
    console.log('updatedArray:', updatedArray);

    setToggleCheckBoxArray(updatedArray);
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

  const getTaskDetail = async () => {
    const response = await getTaskById(taskId);
    console.log('Get task response', response.task);
    if (response.statusCode === 200) {
      setNewTaskDetail({
        summary: response?.task.summary,
        description: response?.task.description,
        isRepeated: response?.task.isRepeated,
        members: response?.task.members.map((member: any) => ({
          _id: member?._id,
          name: member?.name,
          email: member?.email,
          avatar: member?.avatar,
        })),
        recurrence: {
          times: response?.task.recurrence?.times,
          unit: response?.task.recurrence?.unit,
          repeatOn: response?.task.recurrence?.repeatOn,
          ends: response?.task.recurrence?.ends
            ? response?.task.recurrence?.ends //ISO 8601 format
            : undefined,
        },
        startDate: response?.task.startDate, //ISO 8601 format
      });

      setSummary(response?.task.summary);

      setDescription(response?.task.description);

      setStartDatetime(dateFormatWithTime(response?.task.startDate));

      const currentDate = moment();
      const nextMonthDate = currentDate.add(1, 'month');

      setEndDatetime(
        dateFormatWithTime(
          response?.task.recurrence?.ends
            ? response?.task.recurrence?.ends
            : nextMonthDate,
        ),
      );

      setState(response?.task.state);

      setSelectedRecurrenceValue(
        response?.task.isRepeated
          ? recurrenceOptions[1].value
          : recurrenceOptions[0].value,
      );

      setRecurrence({
        times: response?.task.recurrence?.times,
        unit: response?.task.recurrence?.unit,
        repeatOn: response?.task.recurrence?.repeatOn ?? undefined,
        ends: response?.task.recurrence?.ends ?? undefined,
      });

      if (response?.task.recurrence?.unit === 'Day') {
        setSelectedUnit(units[0].value);
      } else if (response?.task.recurrence?.unit === 'Week') {
        setSelectedUnit(units[1].value);
      } else if (response?.task.recurrence?.unit === 'Month') {
        setSelectedUnit(units[2].value);
      } else if (response?.task.recurrence?.unit === 'Year') {
        setSelectedUnit(units[3].value);
      }

      if (response?.task.recurrence?.repeatOn !== null) {
        setRepeatOn(
          response?.task.recurrence?.repeatOn.map((item: any) =>
            convertDayTextToDayNumber(item),
          ),
        );
      } else {
        setRepeatOn([]);
      }

      if (response?.task.recurrence?.repeatOn !== null) {
        let buttonList: number[] = [];
        response?.task.recurrence?.repeatOn.map((day: any) => {
          // console.log('day', day);

          const index = buttons.findIndex(
            item => item === convertDayTextToDayNumber(day),
          );
          // Add index to selectedButtons of index !== -1
          if (index !== -1) {
            buttonList.push(index);
          }
        });
        // console.log('buttonList:', buttonList);

        setSelectedButtons(buttonList);
      } else {
        setSelectedButtons([0]);
      }

      if (response?.task.recurrence?.ends) {
        setSelectedId(radioButtons[1].id);
        // setEndDate(new Date(response?.task.recurrence?.ends));
        console.log('ends', response?.task.recurrence?.ends);
      }

      setIsMounted(true);
    }
  };

  useEffect(() => {
    if (newTaskDetail.members?.length && members.length > 0) {
      setToggleCheckBoxArray(newTaskDetail.members.map((_, index) => true));
    }

    console.log('toggleCheckBoxArray', toggleCheckBoxArray);
    console.log('task.members', newTaskDetail.members);
  }, [task, members]);

  useEffect(() => {
    console.log('taskId', taskId);
    getTaskDetail();
    getMemberList();
  }, []);

  useEffect(() => {
    console.log('task', task);
  }, [task]);

  const renderMembers = () => {
    if (!state) {
      return null;
    }
    return (
      <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          marginTop: 5,
        }}>
        {members.map((member, index) => (
          <View
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: -5,
              gap: 7,
            }}>
            <CheckBox
              key={index}
              tintColors={{true: Colors.checkBox.orange}}
              value={toggleCheckBoxArray[index]}
              onValueChange={newValue => handleToggleCheckBox(index, newValue)}
            />
            <Text>{member.name}</Text>
          </View>
        ))}
        {toggleCheckBoxArray.every(item => !item) && (
          <Text style={styles.error}>Vui lòng chọn thành viên</Text>
        )}
      </View>
    );
  };

  useEffect(() => {
    let selectedDay: string[] = [];
    selectedButtons.map(item => {
      // console.log('item', item);
      // console.log('buttons[index]:', buttons[item]);
      const dateString = convertDayNumberToDayText(buttons[item]);
      if (selectedDay.indexOf(dateString) === -1) {
        selectedDay.push(dateString);
      }
    });
    console.log('selectedDay', selectedDay);

    setRepeatOn(selectedDay);
    setRecurrence({
      ...recurrence,
      repeatOn: selectedDay,
    });
  }, [selectedButtons]);

  const updateTask = async (newTaskDetail: {
    summary: string;
    description: string;
    isRepeated: boolean;
    recurrence?: {
      times?: number;
      unit?: string;
      repeatOn?: string[];
      ends?: string;
    };
    startDate: string;
  }) => {
    const response = await editTaskDetail(taskId, newTaskDetail);

    // console.log('Edit task response', response);

    // if (response.statusCode === 200) {
    //   setNewTaskDetail({
    //     summary: response?.task.summary,
    //     description: response?.task.description,
    //     isRepeated: response?.task.isRepeated,
    //     recurrence: {
    //       times: response?.task.recurrence?.times,
    //       unit: response?.task.recurrence?.unit,
    //       repeatOn: response?.task.recurrence?.repeatOn,
    //       ends: response?.task.recurrence?.ends
    //         ? response?.task.recurrence?.ends //ISO 8601 format
    //         : undefined,
    //     },
    //     startDate: response?.task.startDate, //ISO 8601 format
    //   });

    //   setSummary(response?.task.summary);

    //   setDescription(response?.task.description);

    //   setStartDatetime(dateFormatWithTime(response?.task.startDate));

    //   const currentDate = moment();
    //   const nextMonthDate = currentDate.add(1, 'month');

    //   setEndDatetime(
    //     dateFormatWithTime(
    //       response?.task.recurrence?.ends
    //         ? response?.task.recurrence?.ends
    //         : nextMonthDate,
    //     ),
    //   );

    //   setState(response?.task.state);

    //   setSelectedRecurrenceValue(
    //     response?.task.isRepeated
    //       ? recurrenceOptions[1].value
    //       : recurrenceOptions[0].value,
    //   );

    //   setRecurrence({
    //     times: response?.task.recurrence?.times,
    //     unit: response?.task.recurrence?.unit,
    //     repeatOn: response?.task.recurrence?.repeatOn ?? undefined,
    //     ends: response?.task.recurrence?.ends ?? undefined,
    //   });

    //   if (response?.task.recurrence?.unit === 'Day') {
    //     setSelectedUnit(units[0].value);
    //   } else if (response?.task.recurrence?.unit === 'Week') {
    //     setSelectedUnit(units[1].value);
    //   } else if (response?.task.recurrence?.unit === 'Month') {
    //     setSelectedUnit(units[2].value);
    //   } else if (response?.task.recurrence?.unit === 'Year') {
    //     setSelectedUnit(units[3].value);
    //   }

    //   setRepeatOn(
    //     response?.task.recurrence?.repeatOn.map((item: any) =>
    //       convertDayTextToDayNumber(item),
    //     ),
    //   );

    //   if (response?.task.recurrence?.repeatOn.length > 0) {
    //     let buttonList: number[] = [];
    //     response?.task.recurrence?.repeatOn.map((day: any) => {
    //       // console.log('day', day);

    //       const index = buttons.findIndex(
    //         item => item === convertDayTextToDayNumber(day),
    //       );
    //       // Add index to selectedButtons of index !== -1
    //       if (index !== -1) {
    //         buttonList.push(index);
    //       }
    //     });
    //     // console.log('buttonList:', buttonList);

    //     setSelectedButtons(buttonList);
    //   } else {
    //     setSelectedButtons([0]);
    //   }

    //   if (response?.task.recurrence?.ends) {
    //     setSelectedId(radioButtons[1].id);
    //     // setEndDate(new Date(response?.task.recurrence?.ends));
    //     console.log('ends', response?.task.recurrence?.ends);
    //   }
    // } else {
    //   // setTimes('');
    //   setRepeatOn(['Mon']);
    //   setSelectedButtons([0]);
    //   setSelectedId(radioButtons[0].id);
    //   setEndDate(new Date());
    // }
  };

  // If user selects custom repeat mode but doesn't choose end time then set "repeatOn" and ends" to "undefined"
  useEffect(() => {
    if (selectedRecurrenceValue === 'Custom') {
      if (selectedId === '1') {
        console.log('endDatetime', endDatetime);

        setRecurrence({
          ...recurrence,
          ends: undefined,
        });
      } else if (selectedId === '2') {
        console.log('endDatetime', endDatetime);

        setRecurrence({
          ...recurrence,
          ends: moment(endDatetime, 'DD/MM/YYYY HH:mm A').toISOString(),
        });
      }
    }
  }, [selectedRecurrenceValue, selectedId]);

  useEffect(() => {
    console.log('recurrence', recurrence);
    if (isMounted && selectedRecurrenceValue === 'Custom') {
      setNewTaskDetail({
        ...newTaskDetail,
        isRepeated: true,
        recurrence: {
          times: recurrence.times,
          unit: recurrence.unit,
          repeatOn: recurrence.repeatOn,
          ends: recurrence.ends,
        },
      });
    } else if (isMounted && selectedRecurrenceValue === 'Does not repeat') {
      setNewTaskDetail({
        ...newTaskDetail,
        isRepeated: false,
        recurrence: undefined,
      });
    }
  }, [recurrence]);

  useEffect(() => {
    console.log('newTaskDetail', newTaskDetail);
    if (isMounted) {
      updateTask(newTaskDetail);
    }
  }, [newTaskDetail]);

  useEffect(() => {
    console.log('members', members);
  }, [members]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tiêu đề</Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={value => setSummary(value)}
          onEndEditing={async () => {
            console.log('summary:', summary);

            setNewTaskDetail({
              ...newTaskDetail,
              summary,
            });
          }}
          style={styles.inputText}
          placeholder={'Nhập tóm tắt việc cần làm'}
          placeholderTextColor={Colors.text.lightgrey}
          value={summary}
        />
        {summary && (
          <Ionicons
            onPress={() => setSummary('')}
            name={'close'}
            style={styles.inputIcon}
          />
        )}
      </View>
      {!summary && <Text style={styles.error}>Vui lòng nhập tiêu đề</Text>}

      <Text style={styles.title}>Thời gian bắt đầu</Text>
      <View style={styles.inputContainer}>
        <TextInput
          editable={false}
          onChangeText={value => setStartDatetime(value)}
          style={styles.inputText}
          placeholder={'Chọn thời gian bắt đầu'}
          placeholderTextColor={Colors.text.lightgrey}
          value={startDatetime}
        />

        <DatePicker
          modal
          open={openStartDate}
          date={selectedStartDate}
          mode={'datetime'}
          locale={'vi'}
          title={'Chọn ngày'}
          confirmText={'Chọn'}
          cancelText={'Huỷ'}
          onDateChange={value => {
            console.log('Date change value:', value);

            setSelectedStartDate(value);
          }}
          onConfirm={value => {
            console.log('Selected date:', value);

            setOpenStartDate(false);
            setStartDate(value);
            setStartDatetime(dateFormatWithTime(`${value}`));
            setNewTaskDetail({
              ...newTaskDetail,
              startDate: moment(value).toISOString(),
            });

            // updateTask(newTaskDetail);
          }}
          onCancel={() => {
            setOpenStartDate(false);
          }}
        />

        {startDatetime && (
          <Ionicons
            onPress={() => setStartDatetime('')}
            name={'close'}
            style={[styles.inputIcon, {marginRight: 5}]}
          />
        )}

        <Ionicons
          onPress={() => {
            setOpenStartDate(true);
          }}
          name={'calendar'}
          style={styles.inputIcon}
        />
      </View>
      {!startDatetime && (
        <Text style={styles.error}>Vui lòng chọn thời gian bắt đầu</Text>
      )}

      <Dropdown
        style={{
          width: '90%',
          height: 50,
          borderBottomWidth: 1,
          borderColor: Colors.border.lightgrey,
        }}
        data={recurrenceOptions}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isRecurrenceFocus ? 'Lặp lại' : '...'}
        placeholderStyle={{
          fontSize: 14,
          color: Colors.text.lightgrey,
        }}
        selectedTextStyle={{
          color: Colors.text.grey,
          fontSize: 14,
        }}
        itemTextStyle={{
          color: Colors.text.grey,
          fontSize: 14,
        }}
        value={selectedRecurrenceValue}
        onFocus={() => setIsRecurrenceFocus(true)}
        onBlur={() => setIsRecurrenceFocus(false)}
        onChange={item => {
          setSelectedRecurrenceValue(item.value);
          setIsRecurrenceFocus(false);
        }}
      />
      {selectedRecurrenceValue === 'Custom' && (
        <View style={styles.recurrenceContainer}>
          <View style={styles.timesContainer}>
            <Text>Lặp lại mỗi:</Text>
            <TextInput
              style={styles.timesInput}
              textAlign={'center'}
              keyboardType="numeric"
              value={times}
              onChangeText={text => setTimes(text)}
              onEndEditing={() => {
                setRecurrence({
                  ...recurrence,
                  times: parseInt(times),
                });
              }}
            />

            <Dropdown
              style={{
                width: '30%',
                height: 50,
              }}
              data={units}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isUnitFocus ? 'Chọn đơn vị' : '...'}
              placeholderStyle={{
                color: Colors.text.lightgrey,
              }}
              itemTextStyle={{
                color: Colors.text.grey,
                fontSize: 14,
              }}
              value={selectedUnit}
              onFocus={() => setIsUnitFocus(true)}
              onBlur={() => setIsUnitFocus(false)}
              onChange={item => {
                setSelectedUnit(item.value);
                setIsUnitFocus(false);
                setRecurrence({
                  ...recurrence,
                  repeatOn:
                    item.value === 'Day' ? undefined : recurrence.repeatOn,
                  unit: item.value,
                });
              }}
            />
          </View>
          {recurrence.times.toString().length === 0 && (
            <Text style={styles.error}>
              Vui lòng nhập khoảng thời gian lặp lại
            </Text>
          )}

          {selectedUnit !== 'Day' && (
            <View style={styles.repeatContainer}>
              <Text>Lặp lại vào thứ:</Text>
              <ButtonGroup
                onPress={item => {
                  console.log('item:', item);

                  setSelectedButtons(item);
                }}
                selectMultiple={true}
                selectedIndexes={selectedButtons}
                buttons={buttons}
                containerStyle={{
                  width: '100%',
                  height: 30,
                  borderWidth: 0,
                  marginLeft: 0,
                  // backgroundColor: 'pink',
                }}
                innerBorderStyle={{
                  width: 0,
                }}
                selectedButtonStyle={{
                  backgroundColor: Colors.icon.orange,
                  borderRadius: 50,
                }}
                buttonContainerStyle={{
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}
                buttonStyle={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: Colors.border.orange,
                  backgroundColor: Colors.background.white,
                }}
                textStyle={{
                  color: Colors.text.orange,
                }}
              />
            </View>
          )}

          <View style={styles.endsContainer}>
            <Text>Kết thúc:</Text>
            <RadioGroup
              containerStyle={styles.radioButtonContainer}
              layout="column"
              radioButtons={radioButtons}
              onPress={setSelectedId}
              selectedId={selectedId}
            />
            {selectedId === '2' && (
              <>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      width: '89%',
                      alignSelf: 'flex-end',
                      // backgroundColor: 'pink',
                    },
                  ]}>
                  <TextInput
                    editable={false}
                    // onChangeText={value => setFieldValue('dob', value)}
                    placeholder={'Chọn thời gian kết thúc nhắc nhở'}
                    style={styles.inputText}
                    placeholderTextColor={Colors.text.lightgrey}
                    value={endDatetime}
                  />

                  <DatePicker
                    modal
                    open={openEndDate}
                    date={selectedEndDate}
                    mode={'datetime'}
                    locale={'vi'}
                    title={'Chọn ngày'}
                    confirmText={'Chọn'}
                    cancelText={'Huỷ'}
                    onDateChange={value => {
                      console.log('Date change value:', value);

                      setSelectedEndDate(value);
                    }}
                    onConfirm={value => {
                      console.log('Selected date:', value);

                      setOpenEndDate(false);
                      setEndDate(value);
                      setEndDatetime(dateFormatWithTime(`${value}`));
                      setRecurrence({
                        ...recurrence,
                        ends: moment(value).toISOString(),
                      });
                    }}
                    onCancel={() => {
                      setOpenEndDate(false);
                    }}
                  />

                  {endDatetime && (
                    <Ionicons
                      onPress={() => setEndDatetime('')}
                      name={'close'}
                      style={[styles.inputIcon, {marginRight: 5}]}
                    />
                  )}
                  <Ionicons
                    onPress={() => {
                      setOpenEndDate(true);
                    }}
                    name={'calendar'}
                    style={styles.inputIcon}
                  />
                </View>
                {!endDatetime && selectedId === '2' && (
                  <Text
                    style={[
                      styles.error,
                      {
                        width: '100%',
                        textAlign: 'left',
                        paddingLeft: 40,
                      },
                    ]}>
                    Vui lòng chọn thời gian kết thúc lặp lại
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      )}

      <Text style={styles.title}>Mô tả</Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={value => setDescription(value)}
          onEndEditing={async () => {
            console.log('values.description:', description);

            setNewTaskDetail({
              ...newTaskDetail,
              description,
            });
          }}
          style={styles.inputText}
          placeholder={'Nhập mô tả việc cần làm'}
          placeholderTextColor={Colors.text.lightgrey}
          value={description}
        />
        {description && (
          <Ionicons
            onPress={() => setDescription('')}
            name={'close'}
            style={styles.inputIcon}
          />
        )}
      </View>

      <Text style={[styles.title, {marginTop: 15}]}>Chế độ</Text>
      <View
        style={{
          width: '90%',
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          marginTop: 5,
          alignItems: 'center',
          // justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => setState(!state)}>
          <FontAwesomeIcon
            name={state ? 'toggle-on' : 'toggle-off'}
            style={[styles.inputIcon, {color: Colors.icon.orange}]}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            color: Colors.text.grey,
          }}>
          Nhóm
        </Text>
      </View>
      {/* {state === true && (
        <View
          style={{
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            marginTop: 5,
          }}>
          {members.map((member, index) => (
            <View
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: -5,
                gap: 7,
              }}>
              <CheckBox
                key={index}
                tintColors={{true: Colors.checkBox.orange}}
                value={toggleCheckBoxArray[index]}
                onValueChange={newValue =>
                  handleToggleCheckBox(index, newValue)
                }
              />
              <Text>{member.name}</Text>
            </View>
          ))}
        </View>
      )}
      {toggleCheckBoxArray.every(item => !item) && (
        <Text style={styles.error}>Vui lòng chọn thành viên</Text>
      )} */}

      {renderMembers()}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setIsModalVisible(true);
        }}>
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContentContainer}>
          <Text style={styles.modalTitle}>Xóa sự kiện này?</Text>

          <View style={styles.modalTextContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(!isModalVisible);
              }}
              style={{
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16, color: Colors.text.orange}}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setIsModalVisible(!isModalVisible);

                const response = await deleteTask(task._id);

                console.log('response', response);

                if (response.statusCode === 200) {
                  Toast.show({
                    type: 'success',
                    text1: 'Xóa việc cần làm thành công',
                    autoHide: true,
                    visibilityTime: 1000,
                    onHide: () => {
                      navigation.goBack();
                    },
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: 'Xóa việc cần làm không thành công',
                    autoHide: true,
                    visibilityTime: 1000,
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    width: Dimensions.get('window').width,
    minHeight: '100%',
    backgroundColor: Colors.background.white,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.title.orange,
    lineHeight: 21,
    paddingVertical: 0,
    marginTop: 10,
  },
  inputContainer: {
    width: '90%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 15,
    marginBottom: 5,
    borderColor: Colors.border.lightgrey,
    borderBottomWidth: 1,
    // borderRadius: 10,
  },
  inputIcon: {
    fontWeight: '200',
    color: Colors.icon.lightgrey,
    fontSize: 20,
  },
  inputText: {flex: 1, color: Colors.text.grey},
  error: {
    width: '90%',
    color: Colors.text.red,
    textAlign: 'left',
    marginBottom: 10,
  },
  recurrenceContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  timesContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timesInput: {
    width: '10%',
    paddingLeft: 5,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightgrey,
    color: Colors.text.grey,
  },
  repeatContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  endsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 10,
    // backgroundColor: 'yellow',
  },
  radioButtonContainer: {
    width: '90%',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
  modalContentContainer: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: 10,
    gap: 10,
    padding: 20,
  },
  modalTextContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: 'left',
    color: Colors.text.grey,
  },
  deleteButton: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Colors.buttonBackground.red,
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
});

export default TaskDetailScreen;
