import {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

import CheckBox from '@react-native-community/checkbox';

import {Colors} from '../../../../../constants/color.const';
import {updateTodoInList} from '../../todos/TodosScreen/services/todos.service';

const TodoItem = ({
  todosItem,
}: {
  todosItem: {
    _id: string;
    summary: string;
    todos: {
      _id: string;
      todo: string;
      description: string;
      isCompleted: boolean;
    }[];
  };
}) => {
  const [todos, setTodos] = useState<{
    _id: string;
    summary: string;
    todos: {
      _id: string;
      todo: string;
      description: string;
      isCompleted: boolean;
    }[];
  }>({
    _id: '',
    summary: '',
    todos: [
      {
        _id: '',
        todo: '',
        description: '',
        isCompleted: false,
      },
    ],
  });

  const [toggleCheckBoxArray, setToggleCheckBoxArray] = useState(
    todosItem.todos.map(() => false),
  );

  const handleToggleCheckBox = (index: number, newValue: boolean) => {
    const updatedArray = [...toggleCheckBoxArray];
    console.log('updatedArray:', updatedArray);
    updatedArray[index] = newValue;
    console.log('updatedArray:', updatedArray);

    setToggleCheckBoxArray(updatedArray);

    // set "isCompleted" from todos at index to new value
    const updatedTodos = todos?.todos.map(
      (
        todo: {
          _id: string;
          todo: string;
          description: string;
          isCompleted: boolean;
        },
        i,
      ) => {
        if (i === index) {
          return {
            ...todo,
            isCompleted: newValue,
          };
        }
        return todo;
      },
    );

    // console.log('updatedTodos:', updatedTodos);
    setTodos({
      ...todos,
      todos: updatedTodos,
    });
  };

  useEffect(() => {
    setTodos({
      _id: todosItem._id,
      summary: todosItem.summary,
      todos: todosItem.todos.map((todoItem: any) => {
        return {
          _id: todoItem._id,
          todo: todoItem.todo,
          description: todoItem.description,
          isCompleted: todoItem.isCompleted,
        };
      }),
    });

    setToggleCheckBoxArray(todosItem.todos.map(todo => todo.isCompleted));
  }, []);

  useEffect(() => {
    // console.log('todos changed:', todos);
  }, [todos]);

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: Colors.background.white,
        padding: 10,
        borderRadius: 10,
      }}>
      <Text
        style={{color: Colors.text.orange, fontWeight: 'bold', fontSize: 16}}>
        {todos?.summary}
      </Text>
      <View>
        {todos?.todos.map((todo, index) => {
          return (
            <View
              key={todo._id}
              style={{
                width: '90%',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 10,
              }}>
              <CheckBox
                tintColors={{true: Colors.checkBox.orange}}
                disabled={false}
                value={toggleCheckBoxArray[index]}
                onValueChange={async newValue => {
                  handleToggleCheckBox(index, newValue);

                  if (newValue !== toggleCheckBoxArray[index]) {
                    console.log('checked');

                    const response = await updateTodoInList(
                      todosItem._id,
                      todo._id,
                      {
                        todo: todo.todo,
                        description: todo.description,
                        isCompleted: newValue,
                      },
                    );

                    console.log(
                      'Update isCompleted response:',
                      JSON.stringify(response, null, 2),
                    );
                  } else {
                    console.log('unchecked');
                  }
                }}
                style={{width: '10%'}}
              />
              <View
                style={{
                  width: '95%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                }}>
                <View>
                  <Text style={{color: Colors.text.grey, fontSize: 16}}>
                    {todo.todo}
                  </Text>
                </View>
                <View
                  style={{
                    flexShrink: 1,
                  }}>
                  <Text
                    style={{
                      color: Colors.text.lightgrey,
                      fontSize: 14,
                    }}
                    ellipsizeMode={'tail'}
                    numberOfLines={1}>
                    {todo.description}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default TodoItem;
