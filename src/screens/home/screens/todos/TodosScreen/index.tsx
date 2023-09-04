import {Formik} from 'formik';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import RadioGroup, {
  RadioButton,
  RadioButtonProps,
} from 'react-native-radio-buttons-group';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';

import CheckBox from '@react-native-community/checkbox';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';

import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {
  addTodos,
  changeState,
  deleteTodoInList,
  deleteTodos,
  editSummary,
  getTodosById,
  updateTodoInList,
} from './services/todos.service';
import styles from './styles/styles';
import {getMembers} from '../../../../../services/group.service';
import groupStore from '../../../../../common/store/group.store';

// Define the type for the route params
type TodosRouteParams = {
  todosId: string;
};

// Specify the type for the route
type TodosRouteProp = RouteProp<Record<string, TodosRouteParams>, string>;

const TodosSchema = Yup.object().shape({
  summary: Yup.string().required('Vui lòng nhập tiêu đề'),
  todoName: Yup.string().required('Vui lòng nhập tên việc cần làm'),
});

const TodosScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<TodosRouteProp>();
  const todosId = route?.params?.todosId;

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

  const [todos, setTodos] = useState<{
    _id: string;
    summary: string;
    todos: {
      _id: string;
      todo: string;
      description: string;
      isCompleted: boolean;
      assignee?: string;
    }[];
    state: string;
  }>({
    _id: '',
    summary: '',
    todos: [
      {
        _id: '',
        todo: '',
        description: '',
        isCompleted: false,
        assignee: '',
      },
    ],
    state: '',
  });

  const [toggleCheckBoxArray, setToggleCheckBoxArray] = useState(
    todos.todos.map(todo => todo.isCompleted),
  );

  const [deleteTodo, setDeleteTodo] = useState({
    _id: '',
    todoName: '',
  });
  const [newTodoInfo, setNewTodoInfo] = useState({
    todoName: '',
    todoDescription: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddTodoModalVisible, setIsAddTodoModalVisible] = useState(false);
  const [isDeleteTodosModalVisible, setIsDeleteTodosModalVisible] =
    useState(false);

  const [members, setMembers] = useState<
    {
      role: string;
      id: string;
      name: string;
      email: string;
      avatar: string;
    }[]
  >([]);

  const [assignees, setAssignees] = useState<
    {
      id: string;
      name: string;
      email: string;
      avatar: string;
    }[]
  >([]);

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

  const getTodos = async () => {
    const todosRes = await getTodosById(todosId);
    console.log('todos', JSON.stringify(todosRes.todos.todos[0], null, 2));

    setTodos({
      _id: todosRes?.todos?._id,
      summary: todosRes?.todos?.summary,
      todos:
        todosRes?.todos?.todos?.map((todoItem: any) => {
          return {
            _id: todoItem._id,
            todo: todoItem.todo,
            description: todoItem.description,
            isCompleted: todoItem.isCompleted,
            assignee: todoItem.assignee,
          };
        }) || [],
      state: todosRes?.todos?.state,
    });

    if (todosRes?.todos?.state === 'Public') {
      setSelectedId('2');
    } else {
      setSelectedId('1');
    }

    setToggleCheckBoxArray(
      todosRes?.todos?.todos?.map((todo: any) => todo.isCompleted) || [],
    );
  };

  const changeStatus = async (state: string) => {
    const todosRes = await changeState(todosId, state);
    // console.log('todosRes', JSON.stringify(todosRes, null, 2));
  };

  const handleToggleCheckBox = (index: number, newValue: boolean) => {
    const updatedArray = [...toggleCheckBoxArray];
    console.log('updatedArray:', updatedArray);
    updatedArray[index] = newValue;
    console.log('updatedArray:', updatedArray);

    setToggleCheckBoxArray(updatedArray);

    // set "isCompleted" from todos at index to new value
    const updatedTodos = todos.todos.map((todo, i) => {
      if (i === index) {
        return {
          ...todo,
          isCompleted: newValue,
        };
      }
      return todo;
    });

    console.log('updatedTodos:', updatedTodos);
    setTodos({
      ...todos,
      todos: updatedTodos,
    });
  };

  useEffect(() => {
    console.log('todosId:', todosId);
    getTodos();
    getMemberList();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getTodos();
      getMemberList();
      return () => {
        // Code to clean up the effect when the screen is unfocused
      };
    }, []),
  );

  useEffect(() => {
    if (members.length > 0 && todos.todos.length > 0) {
      // find todos.todos.assignee in members than push to assignees
      const assignees = members.filter((member: any) =>
        todos.todos.map((todos: any) => member.id === todos.assignee),
      );
      setAssignees(assignees);
    }
  }, [members, todos]);

  useEffect(() => {
    console.log('selectedId:', selectedId);
    // Find selectedId in radioButtons
    const selectedRadioButton = radioButtons.find(e => e.id === selectedId);
    const state = selectedRadioButton?.value as string;
    changeStatus(state);
  }, [selectedId]);

  return (
    <Formik
      initialValues={{
        summary: todos?.summary,
        todoName: '',
        todoDescription: '',
      }}
      validationSchema={TodosSchema}
      enableReinitialize={true}
      onSubmit={values => {}}>
      {({
        values,
        errors,
        touched,
        setFieldTouched,
        setFieldValue,
        isValid,
        handleSubmit,
        handleChange,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Tiêu đề</Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setFieldValue('summary', value)}
              onEndEditing={async () => {
                console.log('values.summary:', values.summary);
                const response = await editSummary(todosId, values.summary);
                console.log('Edit summary response:', response);
              }}
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

          <View style={[styles.titleContainer, {marginTop: 10}]}>
            <Text style={styles.title}>Việc cần làm</Text>
            <TouchableOpacity
              onPress={() => {
                setIsAddTodoModalVisible(true);
              }}>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={Colors.icon.orange}
              />
            </TouchableOpacity>
          </View>

          <Modal isVisible={isAddTodoModalVisible}>
            <View style={styles.modalContentContainer}>
              <Text style={styles.modalTitle}>Thêm việc cần làm</Text>

              <View style={[styles.inputContainer, {width: '100%'}]}>
                <TextInput
                  onChangeText={value => setFieldValue('todoName', value)}
                  onSubmitEditing={handleSubmit}
                  onBlur={() => setFieldTouched('todoName')}
                  // onChangeText={text => setSummary(text)}
                  style={styles.inputText}
                  placeholder={'Nhập việc cần làm'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.todoName}
                />
                {values.todoName && (
                  <Ionicons
                    onPress={() => setFieldValue('todoName', '')}
                    name={'close'}
                    style={styles.inputIcon}
                  />
                )}
              </View>
              {touched.todoName && errors.todoName && (
                <Text style={styles.error}>{errors.todoName}</Text>
              )}

              <View style={[styles.inputContainer, {width: '100%'}]}>
                <TextInput
                  onChangeText={value =>
                    setFieldValue('todoDescription', value)
                  }
                  onBlur={() => setFieldTouched('todoDescription')}
                  // onChangeText={text => setSummary(text)}
                  style={styles.inputText}
                  placeholder={'Nhập mô tả việc cần làm'}
                  placeholderTextColor={Colors.text.lightgrey}
                  value={values.todoDescription}
                />
                {values.todoDescription && (
                  <Ionicons
                    onPress={() => setFieldValue('todoDescription', '')}
                    name={'close'}
                    style={styles.inputIcon}
                  />
                )}
              </View>

              <View style={styles.modalTextContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsAddTodoModalVisible(false);
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
                    const response = await addTodos(todos._id, {
                      todos: [
                        {
                          todo: values.todoName,
                          description: values.todoDescription,
                          isCompleted: false,
                        },
                      ],
                      state: todos.state,
                    });
                    // console.log(
                    //   'Add new response:',
                    //   JSON.stringify(response, null, 2),
                    // );

                    if (response.statusCode === 200) {
                      setFieldValue('todoName', '');
                      setFieldTouched('todoName', false);
                      setFieldValue('todoDescription', '');
                      getTodos();
                    }

                    setIsAddTodoModalVisible(false);
                  }}
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: 'red'}}>Thêm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.checkBoxContainer}>
            {todos.todos.length > 0 &&
              todos.todos.map((todo: any, index) => (
                <View key={index} style={styles.todosContainer}>
                  <View style={styles.todo}>
                    <CheckBox
                      tintColors={{true: Colors.checkBox.orange}}
                      disabled={false}
                      value={toggleCheckBoxArray[index]}
                      // value={todos.todos[index].isCompleted}
                      onValueChange={async newValue => {
                        handleToggleCheckBox(index, newValue);
                        console.log('newValue', newValue);

                        console.log('toggle', toggleCheckBoxArray[index]);

                        if (newValue !== toggleCheckBoxArray[index]) {
                          console.log('checked');

                          const response = await updateTodoInList(
                            todosId,
                            todo._id,
                            {
                              todo: todo.todo,
                              description: todo.description,
                              isCompleted: newValue,
                            },
                          );

                          // console.log(
                          //   'Update isCompleted response:',
                          //   JSON.stringify(response, null, 2),
                          // );
                        } else {
                          console.log('unchecked');
                        }
                      }}
                    />
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        // gap: 10,
                      }}>
                      <TextInput
                        value={todo.todo}
                        style={[
                          {
                            color: Colors.text.grey,
                            fontWeight: 'bold',
                            fontSize: 16,
                            height: 20,
                            padding: 0,
                          },
                          toggleCheckBoxArray[index]
                            ? {
                                textDecorationLine: 'line-through',
                              }
                            : {
                                textDecorationLine: 'none',
                              },
                        ]}
                        onChangeText={newValue => {
                          todo.todo = newValue;
                          setNewTodoInfo({
                            todoName: newValue,
                            todoDescription: todo.description,
                          });
                        }}
                        onEndEditing={async () => {
                          console.log('newTodoInfo:', newTodoInfo);

                          const response = await updateTodoInList(
                            todosId,
                            todo._id,
                            {
                              todo: newTodoInfo.todoName,
                              description: todo.description,
                              isCompleted: todo.isCompleted,
                            },
                          );
                        }}
                      />
                      {/* {todo.description && ( */}
                      <TextInput
                        value={todo.description}
                        placeholder={'Nhập mô tả/ghi chú việc cần làm'}
                        placeholderTextColor={Colors.text.lightgrey}
                        style={{
                          color: Colors.text.lightgrey,
                          fontSize: 12,
                          height: 20,
                          padding: 0,
                        }}
                        onChangeText={newValue => {
                          todo.description = newValue;
                          setNewTodoInfo({
                            todoName: todo.todo,
                            todoDescription: newValue,
                          });
                        }}
                        onEndEditing={async () => {
                          console.log('newTodoInfo:', newTodoInfo);

                          const response = await updateTodoInList(
                            todosId,
                            todo._id,
                            {
                              todo: todo.todo,
                              description: newTodoInfo.todoDescription,
                              isCompleted: todo.isCompleted,
                            },
                          );

                          console.log(
                            'Update todo description response:',
                            JSON.stringify(response, null, 2),
                          );
                        }}
                      />
                      {/* )} */}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisible(!isModalVisible);
                      setDeleteTodo({_id: todo._id, todoName: todo.todo});
                    }}>
                    <Ionicons
                      name={'remove-circle'}
                      style={styles.removeIcon}
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </View>

          <Modal
            isVisible={isModalVisible}
            style={{
              backgroundColor: 'transparent',
            }}>
            <View style={styles.modalContentContainer}>
              <Text style={styles.modalTitle}>
                Xóa "{deleteTodo.todoName}" khỏi danh sách danh sách công việc?
              </Text>

              <View style={styles.modalTextContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(!isModalVisible);
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
                    setIsModalVisible(!isModalVisible);
                    const response = await deleteTodoInList(
                      todos._id,
                      deleteTodo._id,
                    );

                    console.log('Delete todo response:', response);

                    if (response.statusCode === 200) {
                      getTodos();
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

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              setIsDeleteTodosModalVisible(true);
            }}>
            <Text style={styles.deleteButtonText}>Xóa</Text>
          </TouchableOpacity>

          <Modal isVisible={isDeleteTodosModalVisible}>
            <View style={styles.modalContentContainer}>
              <Text style={styles.modalTitle}>
                Xóa danh sách công việc này?
              </Text>

              <View style={styles.modalTextContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsDeleteTodosModalVisible(!isDeleteTodosModalVisible);
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
                    setIsDeleteTodosModalVisible(!isDeleteTodosModalVisible);

                    const response = await deleteTodos(todos._id);
                    if (response.statusCode === 200) {
                      Toast.show({
                        type: 'success',
                        text1: 'Xóa công việc thành công',
                        autoHide: true,
                        visibilityTime: 1000,
                        onHide: () => {
                          navigation.goBack();
                        },
                      });
                    } else {
                      Toast.show({
                        type: 'error',
                        text1: 'Xóa công việc không thành công',
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
      )}
    </Formik>
  );
};

export default TodosScreen;
