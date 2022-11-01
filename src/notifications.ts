import { getData, setData } from './dataStore';
// import { isValidToken, isValidUser, getUserId, isDmValid, isDmMember } from './global';
import HTTPError from 'http-errors';

/**
  * Returns the user's most recent 20 notifications, 
  * ordered from most recent to least recent.
  *
  * @param {string} token - a valid token
  *
  * @returns {notifications {channelId: number, dmId: number,
  * notificationMessage: string} } - object notifications
*/

export function getNotificationsV1(token: string) {
  const data = getData();
  // check if token is inside channel/dm message was sent in
  let arr = [];

  // channel, dm invite
  // TODO: add notification key in message/send & message/senddm - need to get notificationMessage,
  // if token in Array<tag>, get message string from its {message}
  // TODO: added to channel/dm - channelinvite, dminvite
  // add another key (think of similar ways as tag i guess)

  // react
  // take from hao's implementation?

  return {
    notifications: {
      channelId: 0,
      dmId: -1,
      notificationMessage: 'willywonka added you to testingNotifs',
    }
  }
}

/*
Array of objects, where each object contains types { channelId, dmId, notificationMessage } where 
      
channelId is the id of the channel that the event happened in, and is -1 if it is being sent to a DM
dmId is the DM that the event happened in, and is -1 if it is being sent to a channel
notificationMessage is a string of the following format for each trigger action:

  tagged: "{User’s handle} tagged you in {channel/DM name}: {first 20 characters of the message}"
  reacted message: "{User’s handle} reacted to your message in {channel/DM name}"
  added to a channel/DM: "{User’s handle} added you to {channel/DM name}"

*/