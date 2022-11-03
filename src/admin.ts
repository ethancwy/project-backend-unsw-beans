import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';

import { isGlobalOwner, getUserId, isValidToken, isValidUser, isInChannel, isInDm } from './global';
import { channelLeaveV2, dmLeaveV2 } from './channel'

function adminUserRemoveV1(token: string, uId: number) {
  // let data = getData();

  // if (!isValidToken(token)) {
  //   throw HTTPError(403, 'token does not exist');
  // }
  // if (!isGlobalOwner(getUserId(token))) {
  //   throw HTTPError(403, 'auth user is not global owner');
  // }

  // if (!isValidUser(uId)) {
  //   throw HTTPError(400, 'user does not exist')
  // }

  // // check is uId is only global owner
  // let globalOwnerCount = 0; 
  // for (const user of data.users) {
  //   if (isGlobalOwner(user.uId)) {
  //     globalOwnerCount++;
  //   }
  // }

  // if (globalOwnerCount === 0) {
  //   throw HTTPError(400, 'uId is only global owner');
  // }

  // // user leaving from all channels
  // for (const channel of data.channels) {
  //   if (isInChannel(uId, channel.channelId)) {
  //     channelLeaveV2(token, channel.channelId);
  //   }
  // }
  
  // // user leaving all dms
  // for (const dm of data.dms) {
  //   if (isInDm(uId, dm.dmId)) {
  //     dmLeaveV2(token, dm.dmId);
  //   }
  // }

  return {};


}

function adminUserpermissionChangeV1(token: string, uId: number, permissionId: number) {
  return {};
}

export {
  adminUserRemoveV1,
  adminUserpermissionChangeV1
};