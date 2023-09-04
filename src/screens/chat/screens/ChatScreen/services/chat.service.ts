import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {GroupChannel} from '@sendbird/chat/groupChannel';
import {
  BaseMessage,
  FileMessageCreateParams,
  MessageListParams,
  UserMessageCreateParams,
} from '@sendbird/chat/message';

import {URL_HOST} from '../../../../../core/config/api/api.config';

export const getMessages = async (channel: GroupChannel) => {
  try {
    const params: MessageListParams = {
      prevResultSize: 50,
      nextResultSize: 50,
      // ...
    };
    const messages: BaseMessage[] = await channel.getMessagesByTimestamp(
      0,
      params,
    );
    // console.log('messages by timestamp', messages);

    // Reverse message array by message.createdAt
    messages.reverse();

    return messages.map((message: any) => {
      return {
        _id: message.messageId,
        text: message.message,
        image: message.plainUrl,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.sender.userId,
          name: message.sender.nickname,
          avatar: message.sender.plainProfileUrl,
        },
      };
    });
  } catch (e) {
    // Todo: Handle error
    console.log('get messages error', e);

    return [];
  }
};

export const sendMessage = async (channel: GroupChannel, message: string) => {
  try {
    const params: UserMessageCreateParams = {
      message: message,
    };

    channel.sendUserMessage(params).onSucceeded((message: any) => {
      const messageId = message.messageId;
      console.log('after send message', message);
    });
  } catch (e) {}
};

export const uploadImage = async (base64String: string) => {
  const uploadImageEndpoint = 'api/file/upload-image-with-base64';
  const reqUrl = `${URL_HOST}${uploadImageEndpoint}`;
  console.log('Upload image:', reqUrl);

  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      reqUrl,
      {
        base64: base64String,
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
    console.log('err:', error);
  }
};

export const sendMessageImageToSendBird = async (
  channel: GroupChannel,
  filename: string,
  fileURL: string,
) => {
  const params: FileMessageCreateParams = {
    fileUrl: fileURL, // Or .fileUrl = FILE_URL (You can also send a file message with a file URL.)
    fileName: filename,
    thumbnailSizes: [
      {maxWidth: 100, maxHeight: 100},
      {maxWidth: 200, maxHeight: 200},
    ],
    // Add the maximum sizes of thumbnail images.
    // Up to three thumbnail images are allowed.// Either DEFAULT or SUPPRESS
  };

  channel.sendFileMessage(params).onSucceeded((message: any) => {
    const messageId = message.messageId;
    console.log(
      'After send file message',
      messageId,
      message.sendingStatus,
      message.plainUrl,
    );
    // console.log('after send messageId', messageId);
  });
};
