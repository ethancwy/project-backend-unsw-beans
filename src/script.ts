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
// import { authRegisterV3, authLoginV3, authPasswordRequestV1, authPasswordResetV1 } from './auth';
// import { clearV1 } from './other';
// import { channelsCreateV3 } from './channels';
// import { dmCreateV2 } from './dm';
// import { messageSendV2, messageSenddmV2, messageReactV1 } from './message';
// import { getNotificationsV1 } from './notifications';

// const timeout = () => console.log('pausing');

// // clearV1();
// // // const data = getData();
// // const globalOwnerId = authRegisterV3('putijak.srey@gmail.com', 'password', 'James', 'Charles');
// // const member1 = authRegisterV3('puti213jak.srey@gmail.com', 'pas231sword', 'Ja321mes', 'Ch321arles');
// // const session1 = authLoginV3('putijak.srey@gmail.com', 'password');
// // const session2 = authLoginV3('putijak.srey@gmail.com', 'password');

// // // const member = authRegisterV3('test@bar.com', 'asasasdsd', 'uwu', 'carles');
// // const channel = channelsCreateV3(globalOwnerId.token, 'testingStandup', true);
// // // channelJoinV3(member.token, channel.channelId);

// // // const owner = userProfileV3(globalOwnerId.token, globalOwnerId.authUserId);
// // // const handle = owner.user.handleStr;
// // // standupStartV1(globalOwnerId.token, channel.channelId, 1);
// // // standupSendV1(globalOwnerId.token, channel.channelId, 'hello');
// // // standupSendV1(member.token, channel.channelId, 'bye');
// // console.log(standupStartV1(globalOwnerId.token, channel.channelId, 10));
// // console.log(standupActiveV1(globalOwnerId.token, channel.channelId));
// // // wait for a few seconds
// // // setTimeout(function () { console.log(channelMessagesV3(globalOwnerId.token, channel.channelId, 0)); }, 5000);
// // // console.log('test');
// // const req = authPasswordRequestV1('putijak.srey@gmail.com');
// // console.log(req);
// // const reset = authPasswordResetV1('miQDzqIvDiJCMTdQwaiq0', 'newonelolo');
