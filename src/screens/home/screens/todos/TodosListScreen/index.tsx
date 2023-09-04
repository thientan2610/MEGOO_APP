import {observer} from 'mobx-react';
import {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';

import groupStore from '../../../../../common/store/group.store';
import userStore from '../../../../../common/store/user.store';
import {Colors} from '../../../../../constants/color.const';
import RouteNames from '../../../../../constants/route-names.const';
import {getTodosList} from './services/todos.list.service';

const TodosListScreen = ({
  navigation,
  state,
}: {
  navigation: any;
  state: string;
}) => {
  const [todos, setTodos] = useState([]);

  const getAllTodos = async () => {
    const todosRes = await getTodosList(groupStore.id);
    console.log('groupStore.id:', groupStore.id);

    if (state === 'Private') {
      // Find all todos with the status 'Private'
      // and created by the currently logged-in user
      const privateTodos = todosRes?.group?.todos?.filter((todos: any) => {
        return (
          todos.state === 'Private' && todos.createdBy._id === userStore.id
        );
      });

      setTodos(
        privateTodos.map((todosItem: any) => {
          console.log('todosItem', JSON.stringify(todosItem, null, 2));

          return {
            _id: todosItem._id,
            summary: todosItem.summary,
            todos: [
              {
                _id: todosItem.todos._id,
                todo: todosItem.todos.todo,
                description: todosItem.todos.description,
                isCompleted: todosItem.todos.isCompleted,
              },
            ],
            state: todosItem.state,
            createdBy: {
              _id: todosItem.createdBy._id,
              name: todosItem.createdBy.name,
              email: todosItem.createdBy.email,
              avatar: todosItem.createdBy.avatar,
            },
          };
        }),
      );
    } else if (state === 'Public') {
      // find all todos with "private" state from todosRes
      const publicTodos = todosRes.group.todos.filter(
        (todos: any) => todos.state === 'Public',
      );

      // console.log('privateTodos', JSON.stringify(publicTodos, null, 2));

      setTodos(
        publicTodos.map((todosItem: any) => {
          return {
            _id: todosItem._id,
            summary: todosItem.summary,
            todos: [
              {
                _id: todosItem.todos._id,
                todo: todosItem.todos.todo,
                description: todosItem.todos.description,
                isCompleted: todosItem.todos.isCompleted,
              },
            ],
            state: todosItem.state,
            createdBy: {
              _id: todosItem.createdBy._id,
              name: todosItem.createdBy.name,
              email: todosItem.createdBy.email,
              avatar: todosItem.createdBy.avatar,
            },
          };
        }),
      );
    }
  };

  useEffect(() => {
    console.log('groupId:', groupStore.id);
    console.log('state:', state);

    getAllTodos();
  }, [state]);

  useFocusEffect(
    useCallback(() => {
      getAllTodos();
      return () => {
        // Code to clean up the effect when the screen is unfocused
      };
    }, []),
  );

  useEffect(() => {
    const todosFullCompleted = todos.filter(
      (todos: {
        groupId: string;
        _id: string;
        summary: string;
        todos: {
          _id: string;
          todo: string;
          description: string;
          isCompleted: boolean;
        }[];
        state: string;
      }) => {
        return todos.todos.some(
          (todoItem: {
            _id: string;
            todo: string;
            description: string;
            isCompleted: boolean;
          }) => {
            return todoItem.isCompleted;
          },
        );
      },
    );
    console.log('todosFullCompleted:', todosFullCompleted);
  }, [todos]);

  const renderTodos = () => {
    return todos.map((todosItem: any) => {
      return (
        <TouchableOpacity
          key={todosItem._id}
          style={{
            width: '90%',
            display: 'flex',
            justifyContent: 'center',
            marginVertical: 10,
            padding: 10,
            gap: 10,
            borderRadius: 10,
            backgroundColor: Colors.background.white,
          }}
          onPress={() => {
            navigation.navigate(RouteNames.TODOS, {
              todosId: todosItem._id,
            });
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text
              style={{
                color: Colors.text.grey,
              }}>
              Tiêu đề:
            </Text>
            <Text
              style={{
                color: Colors.text.grey,
                fontWeight: 'bold',
              }}>
              {todosItem.summary}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
              }}
              source={{uri: todosItem.createdBy.avatar}}
            />
            <Text
              style={{
                color: Colors.text.grey,
              }}>
              {todosItem.createdBy.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Danh sách việc cần làm</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(RouteNames.CREATE_TODOS, {
              groupId: groupStore.id,
            });
          }}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.icon.orange}
          />
        </TouchableOpacity>
      </View>

      {renderTodos()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    width: Dimensions.get('window').width,
    minHeight: Dimensions.get('window').height,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
    // backgroundColor: 'pink',
  },
  title: {
    width: '90%',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.title.orange,
  },
});

export default observer(TodosListScreen);
