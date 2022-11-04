// import { getData, setData } from './dataStore';
// import {
//   getUserId, isValidToken, getMessageDetails, isInChannel, isInDm,
//   getChannelIndex, sleep
// } from './global';
// import { userProfileV3 } from './users';
// import { dmDetailsV2, dmLeaveV2 } from './dm';
// import {
//   channelDetailsV3, channelInviteV3, channelJoinV3, channelLeaveV2,
//   channelMessagesV3
// } from './channel';
// import { standupStartV1, standupActiveV1, standupSendV1 } from './standup';
// import { authRegisterV3 } from './auth';
// import { clearV1 } from './other';
// import { channelsCreateV3 } from './channels';
// import { dmCreateV2 } from './dm';
// import { messageSendV2, messageSenddmV2, messageReactV1 } from './message';
// import { getNotificationsV1 } from './notifications';

// clearV1();
// const data = getData();
// const globalOwnerId = authRegisterV3('foo@bar.com', 'password', 'James', 'Charles');
// const channel = channelsCreateV3(globalOwnerId.token, 'testingStandup', true);
// const owner = userProfileV3(globalOwnerId.token, globalOwnerId.authUserId);
// const handle = owner.user.handleStr;
// standupStartV1(globalOwnerId.token, channel.channelId, 1);
// standupSendV1(globalOwnerId.token, channel.channelId, 'hello');
// console.log(channelMessagesV3(globalOwnerId.token, channel.channelId, 0));
// const index = getChannelIndex(channel.channelId);
// setData(data);
// console.log(data.channels[index]);

