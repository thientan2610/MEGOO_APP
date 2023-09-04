import {Formik} from 'formik';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import RadioGroup, {
  RadioButton,
  RadioButtonProps,
} from 'react-native-radio-buttons-group';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import CheckBox from '@react-native-community/checkbox';
import {RouteProp, useRoute} from '@react-navigation/native';

import groupStore from '../../../../../common/store/group.store';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {createTodos} from './services/create.todos.service';
import styles from './styles/style';
import {getMembers} from '../../../../../services/group.service';
import {toString} from 'lodash';
import Tooltip from 'react-native-walkthrough-tooltip';
import ToolTip from '../../../../../common/components/ToolTip';

const CreateTodoSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tiêu đề'),
  todo: Yup.string().required('Vui lòng nhập tên việc cần làm'),
});

// Define the type for the route params
type GroupRouteParams = {
  groupId: string;
};

// Specify the type for the route
type GroupRouteProp = RouteProp<Record<string, GroupRouteParams>, string>;

const CreateTodosScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<GroupRouteProp>();
  const groupId = groupStore.id;

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Cá nhân',
        value: 'Private',
        size: 20,
        color: Colors.icon.orange,
        labelStyle: {color: Colors.text.grey},
      },
      {
        id: '2',
        label: 'Nhóm',
        value: 'Public',
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

  const [selectedOption, setSelectedOption] = useState<string | undefined>();

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const [isFocus, setIsFocus] = useState(false);

  const [members, setMembers] = useState<
    {
      role: string;
      id: string;
      name: string;
      email: string;
      avatar: string;
    }[]
  >([]);

  const [dropdownMembers, setDropdownMembers] = useState<
    {
      label: string;
      value: string;
      image: {
        uri: string;
      };
    }[]
  >([]);

  const [selectedMember, setSelectedMember] = useState('');

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

  const [todos, setTodos] = useState<Object[]>([]);

  const [toggleCheckBoxArray, setToggleCheckBoxArray] = useState(
    todos.map(() => false),
  );

  const handleToggleCheckBox = (index: number, newValue: boolean) => {
    const updatedArray = [...toggleCheckBoxArray];
    console.log('updatedArray:', updatedArray);
    updatedArray[index] = newValue;
    console.log('updatedArray:', updatedArray);

    setToggleCheckBoxArray(updatedArray);

    // set "isCompleted" from todos at index to new value
    const updatedTodos = todos.map((todo, i) => {
      if (i === index) {
        return {
          ...todo,
          isCompleted: newValue,
        };
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  useEffect(() => {
    // get value from radio button when selectedId changed
    console.log('selectedId', selectedId);
    console.log('radioButtons', radioButtons);

    const selectedRadioButton = radioButtons.find(e => e.id === selectedId);
    console.log('selectedRadioButton', selectedRadioButton);
    setSelectedOption(selectedRadioButton?.value);
  }, [selectedId]);

  useEffect(() => {
    if (selectedId === '1') {
      setSelectedMember('');
    }
  }, [selectedId]);

  useEffect(() => {
    console.log('todos', todos);
  }, [todos]);

  useEffect(() => {
    getMemberList();
  }, []);

  useEffect(() => {
    console.log('members', members);

    if (members.length > 0) {
      setDropdownMembers(
        members.map((member: any) => ({
          label: member.name,
          value: member.id,
          image: {
            uri: member.avatar,
          },
        })),
      );
    } else {
      setDropdownMembers([]);
    }
  }, [members]);

  return (
    <Formik
      initialValues={{
        summary: '',
        todo: '',
        description: '',
        state: selectedOption,
      }}
      validationSchema={CreateTodoSchema}
      // enableReinitialize={true}
      onSubmit={async values => {
        console.log('values', values);
        console.log('todos', todos);
        const checkList = {
          summary: values.summary,
          state: selectedOption,
          todos: todos.map((todo: any) => {
            return {
              todo: todo.todo,
              isCompleted: todo.isCompleted,
              description: todo.description,
              assignee: todo.assignee !== '' ? todo.assignee : undefined,
            };
          }),
        };
        console.log('checkList', JSON.stringify(checkList, null, 2));

        const response = await createTodos(groupId, checkList);
        console.log('Create todos response:', response);

        if (response.statusCode === 201) {
          Toast.show({
            type: 'success',
            text1: 'Thêm việc cần làm thành công',
            autoHide: true,
            visibilityTime: 1000,
            topOffset: 20,
            onHide: () => {
              navigation.navigate(RouteNames.TODOS_TAB, {
                groupId: groupId,
                active: values.state,
              });
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
      }}>
      {({
        setFieldValue,
        setFieldTouched,
        setFieldError,
        handleSubmit,
        isValid,
        values,
        errors,
        touched,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Tiêu đề</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('summary', value)}
              onBlur={() => setFieldTouched('summary')}
              // onChangeText={text => setSummary(text)}
              style={styles.inputText}
              placeholder={'Nhập tóm tắt việc cần làm'}
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

          <Text style={styles.title}>Chế độ</Text>
          <RadioGroup
            containerStyle={styles.radioButtonContainer}
            layout="column"
            radioButtons={radioButtons}
            onPress={setSelectedId}
            selectedId={selectedId}
          />

          <Text style={styles.title}>Việc cần làm</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('todo', value)}
              onBlur={() => setFieldTouched('todo')}
              // onChangeText={text => setSummary(text)}
              style={styles.inputText}
              placeholder={'Nhập tên việc cần làm'}
              placeholderTextColor={Colors.text.lightgrey}
              value={values.todo}
            />
            {values.todo && (
              <Ionicons
                onPress={() => setFieldValue('todo', '')}
                name={'close'}
                style={styles.inputIcon}
              />
            )}
          </View>
          {(touched.todo && errors.todo && (
            <Text style={styles.error}>{errors.todo}</Text>
          )) ||
            (errors.todo && <Text style={styles.error}>{errors.todo}</Text>)}

          <Text style={styles.title}>Mô tả</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('description', value)}
              onBlur={() => setFieldTouched('description')}
              // onChangeText={text => setSummary(text)}
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
          {selectedId === '2' && (
            <>
              <Text style={styles.title}>Người đảm nhận</Text>
              <Dropdown
                style={{
                  width: '90%',
                  height: 50,
                  borderBottomColor: Colors.text.lightgrey,
                  borderBottomWidth: 1,
                }}
                itemTextStyle={{
                  color: Colors.text.grey,
                  fontSize: 14,
                }}
                selectedTextStyle={{
                  color: Colors.text.grey,
                  fontSize: 14,
                }}
                data={dropdownMembers.length > 0 ? dropdownMembers : []}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Chọn người đảm nhận công việc' : '...'}
                placeholderStyle={{
                  color: Colors.text.lightgrey,
                }}
                value={selectedMember}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setSelectedMember(item.value);
                  setIsFocus(false);
                }}
              />
            </>
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              console.log('values', values);

              if (values.todo !== '') {
                if (todos.length === 0) {
                  let selectedMemberIndex = 0;
                  let selectedMemberInfo = {
                    name: '',
                    avatar: '',
                  };

                  if (selectedMember !== '') {
                    // Find selectedMember in members array
                    selectedMemberIndex = members.findIndex(
                      member => member.id === selectedMember,
                    );

                    selectedMemberInfo = {
                      name: members[selectedMemberIndex].name,
                      avatar: members[selectedMemberIndex].avatar,
                    };
                  }

                  setTodos([
                    {
                      todo: values.todo,
                      description: values.description,
                      isCompleted: false,
                      assignee:
                        selectedMember !== '' ? selectedMember : undefined,
                      name:
                        selectedMemberInfo.name !== ''
                          ? selectedMemberInfo.name
                          : '',
                      avatar:
                        selectedMemberInfo.avatar !== ''
                          ? selectedMemberInfo.avatar
                          : '',
                    },
                  ]);
                } else {
                  let selectedMemberIndex = 0;
                  let selectedMemberInfo = {
                    name: '',
                    avatar: '',
                  };

                  if (selectedMember !== '') {
                    // Find selectedMember in members array
                    selectedMemberIndex = members.findIndex(
                      member => member.id === selectedMember,
                    );

                    selectedMemberInfo = {
                      name: members[selectedMemberIndex].name,
                      avatar: members[selectedMemberIndex].avatar,
                    };
                  }

                  setTodos([
                    ...todos,
                    {
                      todo: values.todo,
                      description: values.description,
                      isCompleted: false,
                      assignee:
                        selectedMember !== '' ? selectedMember : undefined,
                      name:
                        selectedMemberInfo.name !== ''
                          ? selectedMemberInfo.name
                          : '',
                      avatar:
                        selectedMemberInfo.avatar !== ''
                          ? selectedMemberInfo.avatar
                          : '',
                    },
                  ]);
                }
              } else {
                setFieldError('todo', 'Vui lòng nhập tên việc cần làm');
              }
            }}>
            <Text style={styles.addButtonText}>Thêm</Text>
          </TouchableOpacity>

          <View
            style={{
              width: '90%',
              display: 'flex',
              gap: 10,
            }}>
            {todos.length > 0 &&
              todos.map((todo: any, index) => (
                <View key={index} style={styles.todosContainer}>
                  <View style={styles.todoContainer}>
                    <CheckBox
                      tintColors={{true: Colors.checkBox.orange}}
                      disabled={false}
                      value={toggleCheckBoxArray[index]}
                      onValueChange={newValue => {
                        handleToggleCheckBox(index, newValue);
                        console.log('newValue', newValue);
                      }}
                    />
                    <View
                      style={{
                        width: '80%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'baseline',
                        gap: 10,
                      }}>
                      <Text
                        style={[
                          {
                            color: Colors.text.grey,
                            fontWeight: 'bold',
                            fontSize: 16,
                          },
                          todo.isCompleted
                            ? {
                                textDecorationLine: 'line-through',
                              }
                            : {},
                        ]}>
                        {todo.todo}
                      </Text>
                      <Text
                        style={{
                          color: Colors.text.lightgrey,
                          fontSize: 12,
                        }}>
                        {todo.description}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '15%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 10,
                    }}>
                    {todo.assignee && (
                      <ToolTip
                        type="image"
                        content={todo.name}
                        imageUrl={todo.avatar}
                        isTooltipVisible={isTooltipVisible}
                        setIsTooltipVisible={setIsTooltipVisible}></ToolTip>
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        // find todo in todos by id then remove
                        const newTodos = todos.filter((todoItem: any) => {
                          return todo.id !== todoItem.id;
                        });

                        setTodos(newTodos);
                      }}>
                      <Ionicons
                        name={'remove-circle'}
                        style={styles.removeIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>

          <TouchableOpacity
            disabled={!isValid}
            onPress={handleSubmit}
            style={[
              styles.createButton,
              {
                backgroundColor: isValid
                  ? Colors.buttonBackground.orange
                  : Colors.buttonBackground.lightorange,
              },
            ]}>
            <Text style={styles.createButtonText}>Tạo</Text>
          </TouchableOpacity>

          <Toast position="top" />
        </ScrollView>
      )}
    </Formik>
  );
};

export default CreateTodosScreen;
