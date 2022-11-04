// package structured message, send to channel (messagesend
import { getData, setData } from './dataStore';
import {
  getUserId, isValidToken, isInChannel, isInDm, isValidChannel,
  isActiveStandup, getChannelIndex, sleep
} from './global';
import { getChannelDetails, getDmDetails } from './global';
import { userProfileV3 } from './users';
import { messageSendV2 } from './message';
import HTTPError from 'http-errors';

const requestTime = () => Math.floor((new Date()).getTime() / 1000);
const timeout = () => console.log('pausing');

export function standupStartV1(token: string, channelId: number, length: number) {
  const data = getData();
  const finishTime = requestTime() + length;
  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  } else if (!isValidChannel(channelId)) {
    throw HTTPError(400, 'Invalid channelId');
  } else if (length <= 0) {
    throw HTTPError(400, 'Length cannot be negative');
  } else if (isActiveStandup(channelId)) {
    throw HTTPError(400, 'Active standup currently running');
  }
  const uId = getUserId(token);
  if (!isInChannel(uId, channelId)) {
    throw HTTPError(403, 'Authorised user not member of channel');
  }

  // setTimeout(timeout, length * 1000);
  const index = getChannelIndex(channelId);
  data.channels[index].standupDetails.isActiveStandup = true;
  data.channels[index].standupDetails.timeFinish = finishTime;

  setData(data);

  sleep(length * 1000);
  // helper function to get from standup message queue (created by standupSend)

  return { timeFinish: requestTime() };
}

export function standupActiveV1(token: string, channelId: number) {
  const data = getData();

  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  } else if (!isValidChannel(channelId)) {
    throw HTTPError(400, 'Invalid channelId');
  }
  const uId = getUserId(token);
  if (!isInChannel(uId, channelId)) {
    throw HTTPError(403, 'Authorised user not member of channel');
  }

  const index = getChannelIndex(channelId);
  const isActive = data.channels[index].standupDetails.isActiveStandup;
  const finishTime = data.channels[index].standupDetails.timeFinish;
  return {
    isActive: (isActive) ? true : false,
    timeFinish: (!isActive) ? null : finishTime,
  };
}


