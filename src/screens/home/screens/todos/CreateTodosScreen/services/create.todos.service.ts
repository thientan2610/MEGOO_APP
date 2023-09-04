import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {URL_HOST} from '../../../../../../core/config/api/api.config';

/**
 * Create todos
 * @param groupId
 * @param todos
 * @returns
 */
export const createTodos = async (groupId: string, todos: any) => {
  const todosEndpoint = `api/pkg-mgmt/todos/${groupId}`;
  const reqUrl = `${URL_HOST}${todosEndpoint}`;
  console.log('Create todos:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(reqUrl, todos, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Create todos error: ', error);
  }
};

/**
 * Delete todos by id
 * @param todoId
 * @returns
 */
export const deleteTodos = async (todoId: string) => {
  const todosEndpoint = `api/pkg-mgmt/todos/${todoId}`;
  const reqUrl = `${URL_HOST}${todosEndpoint}`;
  console.log('Delete todos by id:', reqUrl);

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
    console.log('Delete todos by id error: ', error);
  }
};
