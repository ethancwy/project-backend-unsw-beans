// package structured message, send to channel (messagesend
import { getData, setData } from './dataStore';
import {
  getUserId, isValidToken, isInChannel, isInDm, isValidChannel,
  isActiveStandup, getChannelIndex,
} from './global';
import { getChannelDetails, getDmDetails } from './global';
import { userProfileV3 } from './users';
import { messageSendV2 } from './message';
import HTTPError from 'http-errors';

const requestTime = () => Math.floor((new Date()).getTime() / 1000);

const sleep = async (milliseconds) => {
  await new Promise(resolve => {
    return setTimeout(resolve, milliseconds)
  });
};

const testSleep = async (length: number, channelId: number, index: number, uId: number) => {
  await sleep(length * 1000);
  standupMessage(channelId, index, uId);
}

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

  // sleep for length duration, then send messages to channel
  testSleep(length, channelId, index, uId);

  return { timeFinish: finishTime };
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
    isActive: !!(isActive),
    timeFinish: (!isActive) ? null : finishTime,
  };
}

export function standupSendV1(token: string, channelId: number, message: string) {
  const data = getData();

  if (!isValidToken(token)) {
    throw HTTPError(403, 'Invalid token');
  } else if (!isValidChannel(channelId)) {
    throw HTTPError(400, 'Invalid channelId');
  } else if (message.length > 1000) {
    throw HTTPError(400, 'Length cannot be over 1000 characters');
  } else if (!isActiveStandup(channelId)) {
    throw HTTPError(400, 'No active standup currently running');
  }
  const uId = getUserId(token);
  if (!isInChannel(uId, channelId)) {
    throw HTTPError(403, 'Authorised user not member of channel');
  }

  const user = userProfileV3(token, uId);
  const handle = user.user.handleStr;

  const output: string = `${handle}: ${message}`;

  const index = getChannelIndex(channelId);
  data.channels[index].standupDetails.standupMessages.push(output);

  setData(data);
  return {};
}

// helper function that sends message to channel after end of standupStart
function standupMessage(channelId: number, index: number, uId: number) {
  const data = getData();
  let finalOutput = '';
  let standupChannel = data.channels[index].standupDetails;

  if (standupChannel.standupMessages.length !== 0) {
    for (let i = 0; i < standupChannel.standupMessages.length - 1; i++) {
      finalOutput += (standupChannel.standupMessages[i] + '\n');
    }
    // don't print newline for last message
    finalOutput += standupChannel.standupMessages[standupChannel.standupMessages.length - 1];

    const messageId = data.messageDetails.length;

    const newMessage = {
      messageId: messageId,
      uId: uId,
      message: finalOutput,
      timeSent: requestTime(),
      reacts: [],
      isPinned: false,
      tags: [],
    };
    data.channels[index].channelmessages.push(newMessage);
  }

  // no longer active
  standupChannel.isActiveStandup = false;
  standupChannel.standupMessages = [];
  delete standupChannel.timeFinish;
  setData(data);
  return {};
}
