import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';

import { isGlobalOwner, getUserId, isValidToken, isValidUser, isInChannel, isInDm } from './global';
import { channelLeaveV2 } from './channel';
import { dmLeaveV2 } from './dm';

import { message, user } from './dataStore';

function adminUserRemoveV1(token: string, uId: number) {
  const data = getData();

  if (!isValidToken(token)) {
    throw HTTPError(403, 'token does not exist');
  }
  if (!isGlobalOwner(getUserId(token))) {
    throw HTTPError(403, 'auth user is not global owner');
  }

  if (!isValidUser(uId)) {
    throw HTTPError(400, 'user does not exist');
  }

  const userToRemove = data.users.find((user: user) => user.uId === uId);
  if (userToRemove.isRemoved) {
    throw HTTPError(400, 'user already removed');
  }

  // check is uId is only global owner
  let globalOwnerCount = 0;
  for (const user of data.users) {
    if (isGlobalOwner(user.uId)) {
      globalOwnerCount++;
    }
  }

  if (globalOwnerCount === 1 && isGlobalOwner(uId)) {
    throw HTTPError(400, 'uId is only global owner');
  }

  // user leaving from all channels(editing all messages)
  for (const channel of data.channels) {
    if (isInChannel(uId, channel.channelId)) {
      // editing channel message sent by uid to : Removed user
      channel.channelmessages.forEach((msg: message) => {
        if (msg.uId === uId) {
          msg.message = 'Removed user';
        }
      });
      channelLeaveV2(token, channel.channelId);
    }
  }

  // user leaving all dms(editing all messages)
  for (const dm of data.dms) {
    if (isInDm(uId, dm.dmId)) {
      // editing dm message sent by uid to : Removed user
      dm.messages.forEach((msg: message) => {
        if (msg.uId === uId) {
          msg.message = 'Removed user';
        }
      });
      dmLeaveV2(token, dm.dmId);
    }
  }

  const userIndex = data.users.findIndex((userob: user) => userob.uId === uId);
  const removedUser = data.users[userIndex];
  removedUser.isRemoved = true;
  removedUser.nameFirst = 'Removed';
  removedUser.nameLast = 'user';

  setData(data);
  return {};
}

function adminUserpermissionChangeV1(token: string, uId: number, permissionId: number) {
  return {};
}

export {
  adminUserRemoveV1,
  adminUserpermissionChangeV1
};
