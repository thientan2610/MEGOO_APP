import axios from 'axios';
import Toast from 'react-native-toast-message';
import {io, Socket} from 'socket.io-client';

import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {getItemById} from '../../screens/storage/services/items.service';

import userStore from '../../common/store/user.store';
import {URL_HOST, URL_SOCKET} from '../config/api/api.config';
import {displayNotification} from '../push-notifee/notifee';
import {getNewGroupProductById} from '../../screens/storage/services/new-group-products.service';

export let socket: Socket;

export function connectSocket(userId: string) {
  const token = userId;
  console.log('socket token:', token);

  // Connect socket on port 3001, change to ngrok link if can't connect by localhost;
  // socket = io(URL_SOCKET, {
  //   autoConnect: false,
  //   query: {token},
  // });

  socket = io(URL_SOCKET, {
    autoConnect: false,
    path:
      URL_SOCKET.includes('localhost') || URL_SOCKET.includes('ngrok')
        ? undefined
        : '/ws/',
    query: {token},
  });

  socket.connect();

  // Waiting for socket to connect
  onConnect();
}

export function onConnect() {
  socket.on('connect', () => {
    console.log('Connected to server');
    console.log('socket id:', socket.id);

    // Listen for socket events
    listen();
  });
}

export async function listen() {
  // todo: listen for socket events
  onZpCallback();
  onVnpCallback();

  onCreatedBill();
  onUpdatedBill();
  onSendBillRequest();

  onCreatedTodos();
  onUpdatedTodos();

  onTaskReminder();

  onProdNoti();
  onFunding();

  onRestockNoti();
}

export function onZpCallback() {
  socket.on('zpCallback', async (data: any) => {
    console.log('zpCallback data:', data);

    const dataObj = JSON.parse(data);
    console.log('dataObj app trans id:', dataObj.app_trans_id);

    // Request permissions (required for iOS)
    // await notifee.requestPermission();

    displayNotification(
      'Thanh toán thành công',
      `Đơn hàng ${dataObj.app_trans_id} của bạn đã thanh toán thành công.`,
    );
  });
}

export function onVnpCallback() {
  socket.on('vnpCallback', async (data: any) => {
    console.log('vnpCallback data:', data);

    // const dataObj = JSON.parse(data);
    // console.log('dataObj app trans id:', dataObj.app_trans_id);

    // Request permissions (required for iOS)
    // await notifee.requestPermission();

    displayNotification(
      'Thanh toán thành công',
      `Đơn hàng ${data.vnp_TxnRef} của bạn đã thanh toán thành công.`,
    );

    Toast.show({
      type: 'success',
      text1: 'Thanh toán thành công',
      autoHide: true,
      visibilityTime: 3000,
      topOffset: 20,
      onHide: () => {
        const navigation = useNavigation();
        navigation.navigate(
          'PROFILE_STACK' as never,
          {
            params: {
              screen: 'PROFILE',
              activeTab: 'group',
            },
          } as never,
        );
      },
    });
  });
}

const getUserInfo = async (userId: string) => {
  const userEndpoint = `api/users/${userId}`;
  const reqUrl = `${URL_HOST}${userEndpoint}`;
  console.log('Get user info:', reqUrl);

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
    console.log('Get user info error: ', error);
  }
};

export function onCreatedBill() {
  socket.on('createdBill', async (data: any) => {
    console.log('createdBill data:', data);

    const response = await getUserInfo(data.lender);
    console.log('response:', response.user.name);

    const billNoti = await AsyncStorage.getItem('billNoti');

    if (billNoti === 'true') {
      if (userStore.id === data.lender) {
        displayNotification(
          'Phiếu nhắc nợ mới',
          `Bạn nhận được yêu cầu trả nợ mới từ ${response.user.name}.`,
        );
      }
    }
  });
}

export function onUpdatedBill() {
  socket.on('updatedBill', async (data: any) => {
    console.log('updatedBill data:', data);

    const response = await getUserInfo(data.updatedBy);
    console.log('response:', response.user.name);

    const billNoti = await AsyncStorage.getItem('billNoti');

    if (billNoti === 'true') {
      displayNotification(
        'Cập nhật phiếu nhắc nợ',
        ` ${response.user.name} vừa cập nhật phiếu nhắc nợ ${data.summary}`,
      );
    }
  });
}

export function onSendBillRequest() {
  socket.on('billing_req', async (data: any) => {
    console.log('Send bill req data:', data);

    const billNoti = await AsyncStorage.getItem('billNoti');

    if (billNoti === 'true') {
      if (userStore.id === data.data.borrower) {
        const response = await getUserInfo(data.data.borrower);
        console.log('response:', response.user.name);

        displayNotification(
          'Nhắc nhở trả nợ',
          `Bạn có yêu cầu nhắc nhở trả nợ từ ${response.user.name}`,
        );
      } else {
        const response = await getUserInfo(data.from_user);
        console.log('response:', response.user.name);

        displayNotification(
          'Nhắc nhở kiểm tra trạng thái',
          `Bạn có yêu cầu nhắc nhở kiểm tra trạng thái trả nợ từ ${response.user.name}`,
        );
      }
    }
  });
}

export function onCreatedTodos() {
  socket.on('createdTodos', async (data: any) => {
    console.log('createdTodos data:', data);

    const response = await getUserInfo(data.createdBy);
    console.log('response:', response.user.name);

    const todosNoti = await AsyncStorage.getItem('todosNoti');
    console.log('todosNoti get from storage:', todosNoti);
    console.log('todosNoti type get from storage:', typeof todosNoti);

    if (todosNoti === 'true') {
      if (data.state === 'Public') {
        if (userStore.id === data.createdBy) {
          displayNotification(
            'Việc cần làm mới',
            `${response.user.name} đã thêm việc cần làm: ${data.summary}.`,
          );
        }
      }
    }
  });
}

export function onUpdatedTodos() {
  socket.on('updatedTodos', async (data: any) => {
    console.log('updatedTodos data:', data);

    const response = await getUserInfo(data.createdBy);
    console.log('response:', response.user.name);

    const todosNoti = await AsyncStorage.getItem('todosNoti');

    if (todosNoti === 'true') {
      if (data.state === 'Public') {
        displayNotification(
          'Cập nhật việc cần làm',
          `${response.user.name} đã cập nhật việc cần làm: ${data.summary}.`,
        );
      }
    }
  });
}

export function onTaskReminder() {
  socket.on('taskReminder', async (data: any) => {
    console.log('taskReminder data:', data);

    // const response = await getUserInfo(data.createdBy);
    // console.log('response:', response.user.name);

    const calendarNoti = await AsyncStorage.getItem('calendarNoti');

    if (calendarNoti === 'true') {
      displayNotification(
        'Nhắc nhở việc cần làm',
        `<b>${data.summary}</b>
        ${data.description}`,
      );
    }
  });
}

export function onProdNoti() {
  interface IProdNoti {
    type: 'outOfStock' | 'runningOutOfStock' | 'expiringSoon' | 'expired';
    itemId: string;
    groupId: string;
  }

  socket.on('prodNoti', async (data: IProdNoti) => {
    console.log('prodNoti data:', data);

    const resDto = await getItemById({
      groupId: data.groupId,
      id: data.itemId,
    });

    const item = resDto.data;

    // displayNotification
    let message = '';

    switch (data.type) {
      case 'outOfStock':
        message = `Nhu yếu phẩm <b>${item?.groupProduct?.name}</b> đã hết !`;
        break;
      case 'runningOutOfStock':
        message = `Nhu yếu phẩm <b>${item?.groupProduct?.name}</b> sắp hết ! Chỉ còn ${item?.quantity} ${item?.unit}`;
        break;
      case 'expiringSoon':
        message = `Nhu yếu phẩm <b>${item?.groupProduct?.name}</b> sắp hết hạn sử dụng !`;
        break;
      case 'expired':
        message = `Nhu yếu phẩm <b>${item?.groupProduct?.name}</b> đã hết hạn sử dụng !`;
        break;
      default:
        break;
    }

    if (message.length > 0) {
      displayNotification('Nhắc nhở nhu yếu phẩm', message);
    }
  });
}
export function onFunding() {
  socket.on('funding', async (data: any) => {
    console.log('funding data:', data);

    // const response = await getUserInfo(data.createdBy);
    // console.log('response:', response.user.name);

    const fundNoti = await AsyncStorage.getItem('fundNoti');

    if (fundNoti === 'true') {
      displayNotification('Nhắc nhở đóng quỹ nhóm', `<b>${data.summary}</b>`);
    }
  });
}

/*
## Bo sung nhu yeu pham

- Event: 'restockNoti'

Payload

```typescript
interface IRestockNoti {
    itemId: string;
    groupId: string;
}
```
*/

export function onRestockNoti() {
  interface IRestockNoti {
    id: string;
    groupId: string;
  }

  socket.on('restockNoti', async (data: IRestockNoti) => {
    console.log('restockNoti data:', data);

    const resDto = await getNewGroupProductById({
      groupId: data.groupId,
      id: data.id,
    });

    console.log('resDto:', JSON.stringify(resDto, null, 2));

    const item = resDto.data;

    // displayNotification
    let message = '';

    message = `Nhu yếu phẩm <b>${item?.name}</b> cần được bổ sung !`;

    if (message.length > 0) {
      displayNotification('Nhắc nhở nhu yếu phẩm', message);
    }
  });
}
