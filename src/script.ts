import { getData, setData } from './dataStore';
import { getUserId, isValidToken, getMessageDetails, isInChannel, isInDm } from './global';
import { userProfileV3 } from './users';
import { dmDetailsV2 } from './dm';
import { channelDetailsV3, channelInviteV3, channelJoinV3, channelLeaveV2 } from './channel';


import { authRegisterV3 } from './auth';
import { clearV1 } from './other';
import { channelsCreateV3 } from './channels';
import { dmCreateV2 } from './dm';
import { messageSendV2, messageSenddmV2, messageReactV1 } from './message';
import { getNotificationsV1 } from './notifications';

clearV1();
const globalOwnerId = authRegisterV3('foo@bar.com', 'password', 'James', 'Charles');
const channelOwner1 = authRegisterV3('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');

const channel1 = channelsCreateV3(channelOwner1.token, 'testingNotifs1', true);
const join = channelInviteV3(channelOwner1.token, channel1.channelId, globalOwnerId.authUserId);

const channelMessage = messageSendV2(globalOwnerId.token, channel1.channelId, 'hi @jamescharles again');

const leave = channelLeaveV2(globalOwnerId.token, channel1.channelId);
console.log(getNotificationsV1(globalOwnerId.token));