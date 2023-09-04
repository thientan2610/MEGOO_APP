import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../../../../../core/config/api/api.config';

export const getTodosById = async (todosId: string) => {
  const todosEndpoint = `api/pkg-mgmt/todos/${todosId}`;
  const reqUrl = `${URL_HOST}${todosEndpoint}`;
  console.log('Get todos by id:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.get(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Get todos error: ', error);
  }
};

export const addTodos = async (
  todosId: string,
  newTodos: {
    todos: [{todo: string; description: string; isCompleted: boolean}];
    state: string;
  },
) => {
  const todoEndpoint = `api/pkg-mgmt/todos/${todosId}/todo`;
  const reqUrl = `${URL_HOST}${todoEndpoint}`;
  console.log('Add new todos to checklist:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      reqUrl,
      {
        todos: newTodos.todos,
        state: newTodos.state,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log('Add new todos error: ', error);
  }
};

export const deleteTodos = async (todosId: string) => {
  const todosEndpoint = `api/pkg-mgmt/todos/${todosId}`;
  const reqUrl = `${URL_HOST}${todosEndpoint}`;
  console.log('Delete todos:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.delete(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Delete todos error: ', error);
  }
};

export const updateTodoInList = async (
  todosId: string,
  todoId: string,
  todo: {todo: string; description: string; isCompleted: boolean},
) => {
  const todoEndpoint = `api/pkg-mgmt/todos/${todosId}/todo/${todoId}`;
  const reqUrl = `${URL_HOST}${todoEndpoint}`;
  console.log('Update todo by id:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.put(
      reqUrl,
      {
        todo: todo.todo,
        description: todo.description,
        isCompleted: todo.isCompleted,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log('Update todo error: ', error);
  }
};

export const deleteTodoInList = async (todosId: string, todoId: string) => {
  const todoEndpoint = `api/pkg-mgmt/todos/${todosId}/todo`;
  const reqUrl = `${URL_HOST}${todoEndpoint}`;
  console.log('Delete todo by id:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.delete(reqUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        todos: [
          {
            _id: todoId,
          },
        ],
      },
    });

    return response.data;
  } catch (error) {
    console.log('Delete todo error: ', error);
  }
};

export const editSummary = async (todosId: string, summary: string) => {
  const todoEndpoint = `api/pkg-mgmt/todos/${todosId}`;
  const reqUrl = `${URL_HOST}${todoEndpoint}`;
  console.log('Edit summary:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.put(
      reqUrl,
      {
        summary: summary,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log('Edit summary error: ', error);
  }
};

export const changeState = async (todosId: string, state: string) => {
  const todoEndpoint = `api/pkg-mgmt/todos/${todosId}/state`;
  const reqUrl = `${URL_HOST}${todoEndpoint}`;
  console.log('Change todos state:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.put(
      reqUrl,
      {
        state: state,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log('Change todos state error: ', error);
  }
};
