import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SendbirdChat, {
  SendbirdChatParams,
  User,
  UserUpdateParams,
} from '@sendbird/chat';
import {
  GroupChannel,
  GroupChannelCreateParams,
  GroupChannelModule,
} from '@sendbird/chat/groupChannel';
import {OpenChannelModule} from '@sendbird/chat/openChannel';

import userStore from '../common/store/user.store';
import {URL_HOST} from '../core/config/api/api.config';

// const appId = 'ADD4546B-CF09-4980-B6AC-DB7FFD2E70EC';

// const params = {
//   appId: appId,
//   modules: [new GroupChannelModule()],
// };

// export const sendbird = SendbirdChat.init(params);

// export const connectSendBird = async (userId: string) => {
//   try {
//     const user = await sendbird.connect(userId);

//     return user;
//   } catch (error) {
//     console.log("Error connecting to SendBird's server:", error);
//   }
// };

// export const createGroupChannel = async (
//   channelName: string,
//   userIds: string[],
// ) => {
//   try {
//     const params: GroupChannelCreateParams = {
//       invitedUserIds: userIds,
//       name: channelName,
//     };

//     const channel: GroupChannel = await sendbird.groupChannel.createChannel(
//       params,
//     );

//     return channel;
//   } catch (error) {
//     console.error('Error creating channel:', error);
//   }
// };

// export const getChannels = async () => {
//   const getChannelsEndpoint = `api/pkg-mgmt/gr/user_id/channel`;
//   const reqUrl = `${URL_HOST}${getChannelsEndpoint}`;
//   console.log('Get channels group:', reqUrl);

//   const accessToken = await AsyncStorage.getItem('accessToken');

//   try {
//     const response = await axios.get(reqUrl, {
//       headers: {
//         Accept: 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.log('Get channels error:', error);
//   }
// };

// export const createChannel = async (groupId: string, channelUrl: string) => {
//   const createChannelEndpoint = `api/pkg-mgmt/gr/${groupId}/channel`;
//   const reqUrl = `${URL_HOST}${createChannelEndpoint}`;
//   console.log('Create channel group:', reqUrl);

//   const accessToken = await AsyncStorage.getItem('accessToken');

//   try {
//     const response = await axios.post(
//       reqUrl,
//       {
//         channel: channelUrl,
//       },
//       {
//         headers: {
//           Accept: 'application/json',
//           Authorization: `Bearer ${accessToken}`,
//         },
//       },
//     );

//     return response.data;
//   } catch (error) {
//     console.log('Create channel error:', error);
//   }
// };

/**
 * Singleton class for SendBird Chat SDK
 */
export class SendBirdChatService {
  private static instance: SendBirdChatService;

  private static appId = 'ADD4546B-CF09-4980-B6AC-DB7FFD2E70EC';

  private static params = {
    appId: SendBirdChatService.appId,
    modules: [new GroupChannelModule()],
  };

  private URL_SENDBIRD: string = `https://api-${SendBirdChatService.appId}.sendbird.com/v3`;

  private SENDBIRD_SECONDARY_TOKEN: string =
    '52c924b0bad3d93048240e561c59da60849c6127';

  public sendbird = SendbirdChat.init(SendBirdChatService.params);

  private constructor() {}

  public static getInstance(): SendBirdChatService {
    if (!SendBirdChatService.instance) {
      SendBirdChatService.instance = new SendBirdChatService();
    }

    return SendBirdChatService.instance;
  }

  /**
   * Connect user to SendBird's server
   * @param userId
   * @return user object
   */
  public async connect(userId: string) {
    try {
      const user = await this.sendbird.connect(userId);

      return user;
    } catch (error) {
      console.log("Error connecting to SendBird's server:", error);
    }
  }

  public async updateUserInfo(nickname: string, profileURL: string) {
    try {
      const params: UserUpdateParams = {
        nickname: nickname,
        profileUrl: profileURL,
      };
      const user = await this.sendbird.updateCurrentUserInfo(params);
      return user;
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  }

  /**
   * Create a group channel on SendBird server
   * @param channelName: name of the channel
   * @param userIds: list of user IDs to invite to the channel
   * @return channel: GroupChannel if successful, undefined otherwise
   */
  public async createGroupChannel(
    channelName: string,
    coverUrl: string,
    userIds: string[],
  ): Promise<GroupChannel | undefined> {
    try {
      const params: GroupChannelCreateParams = {
        invitedUserIds: userIds,
        name: channelName,
        coverUrl: coverUrl,
      };

      const channel: GroupChannel =
        await SendBirdChatService.getInstance().sendbird.groupChannel.createChannel(
          params,
        );

      return channel;
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  }

  /**
   * Get SendBird channels url from server
   * @return response from server containing array of channels url
   */
  public async getChannels() {
    const getChannelsEndpoint = `api/pkg-mgmt/gr/user?projection=channel`;
    const reqUrl = `${URL_HOST}${getChannelsEndpoint}`;
    console.log('Get channels group:', reqUrl);

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
      console.error('Get channels error:', error);
    }
  }

  /**
   *
   * @param groupId
   * @param channelUrl : SendBird channel url
   * @returns
   */
  public async createChannel(groupId: string, channelUrl: string) {
    const createChannelEndpoint = `api/pkg-mgmt/gr/${groupId}/channel`;
    const reqUrl = `${URL_HOST}${createChannelEndpoint}`;
    console.log('Create channel group:', reqUrl);

    const accessToken = await AsyncStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        reqUrl,
        {
          channel: channelUrl,
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
      console.log('Create channel error:', error);
    }
  }

  public async inviteUserToChannel(channelUrl: string, userIds: string[]) {
    const inviteUserEndpoint = `/group_channels/${channelUrl}/invite`;
    const reqUrl = `${this.URL_SENDBIRD}${inviteUserEndpoint}`;

    try {
      const response = await axios.post(
        reqUrl,
        {
          channel_url: channelUrl,
          user_ids: userIds,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Api-Token': this.SENDBIRD_SECONDARY_TOKEN,
          },
        },
      );

      console.log('Invite user to channel response:', response.data);

      return response.data;
    } catch (error) {
      console.log('Error inviting user to channel:', error);
    }
  }

  /**
   * Accept invitation to join a SendBird channel
   * @param channelUrl
   * @param userId
   * @returns
   */
  public async acceptInvitation(channelUrl: string, userId: string) {
    const acceptInvitationEndpoint = `/group_channels/${channelUrl}/invite`;
    const reqUrl = `${this.URL_SENDBIRD}${acceptInvitationEndpoint}`;

    try {
      const response = await axios.put(
        reqUrl,
        {
          channel_url: channelUrl,
          user_id: userId,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Api-Token': this.SENDBIRD_SECONDARY_TOKEN,
          },
        },
      );

      console.log('Accept invitation response:', response.data);

      return response.data;
    } catch (error) {
      console.log('Error accepting invitation:', error);
    }
  }
}
