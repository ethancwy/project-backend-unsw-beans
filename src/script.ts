// import { getData, setData } from './dataStore';
// import { getUserId, isValidToken, getMessageDetails, isInChannel, isInDm } from './global';
// import { userProfileV3 } from './users';
// import { dmDetailsV2, dmLeaveV2 } from './dm';
// import { channelDetailsV3, channelInviteV3, channelJoinV3, channelLeaveV2 } from './channel';

// import { authRegisterV3 } from './auth';
// import { clearV1 } from './other';
// import { channelsCreateV3 } from './channels';
// import { dmCreateV2 } from './dm';
// import { messageSendV2, messageSenddmV2, messageReactV1 } from './message';
// import { getNotificationsV1 } from './notifications';

// clearV1();
// const globalOwnerId = authRegisterV3('foo@bar.com', 'password', 'James', 'Charles');
// const dmMember = authRegisterV3('chocolate@bar.com', 'g00dpa31ssword', 'Willy', 'Wonka');
// const dmOwner = authRegisterV3('chocola231te@bar.com', 'g00dpass31word', 'billy', 'bonka');

// // const channel1 = channelsCreateV3(channelOwner1.token, 'testingNotifs1', true);
// // const join = channelInviteV3(channelOwner1.token, channel1.channelId, globalOwnerId.authUserId);
// const dm = dmCreateV2(dmOwner.token, [dmMember.authUserId, globalOwnerId.authUserId]);

// const dmMessage = messageSenddmV2(globalOwnerId.token, dm.dmId, 'hi  again');
// const dmMessage2 = messageSenddmV2(dmOwner.token, dm.dmId, 'LOLOLOLOLOL ');

// const react = messageReactV1(globalOwnerId.token, dmMessage.messageId, 1);
// const react2 = messageReactV1(dmOwner.token, dmMessage2.messageId, 1);

// console.log('global owner');
// console.log('global owner');
// console.log(getNotificationsV1(globalOwnerId.token))
// console.log('dm member');
// console.log('dm member');
// console.log(getNotificationsV1(dmMember.token))
