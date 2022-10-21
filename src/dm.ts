import { getData, setData } from './dataStore';
import { isValidToken, isValidUser, getUserId, isDmValid, isDmMember } from './global';

function dmCreatev1(token: string, uId: number[]) {
  const data = getData();

  // Is the token valid
  if (isValidToken(token) === false) {
    return { error: 'error' };
  }

  // Are all the uids valid
  for (const uids of uId) {
    if (isValidUser(uids) === false) {
      return { error: 'error' };
    }
  }

  // Are there any duplicate uids
  for (let i = 0; i < uId.length; i++) {
    for (let j = 0; j < uId.length; j++) {
      if (j !== i && uId[j] === uId[i]) {
        return { error: 'error' };
      }
    }
  }

  const ownerId = getUserId(token);
  // Sorting names
  // Pushing owners name
  const ownerName = data.users[ownerId].handleStr;
  const array = [];
  array.push(ownerName);
  // Pushing members names
  for (const uids of uId) {
    array.push(data.users[uids].handleStr);
  }

  // Sorting names in alphabteical order
  let temp;
  for (let i = 1; i < array.length; i++) {
    if (array[i].localeCompare(array[i - 1]) === -1) {
      temp = array[i];
      array[i] = array[i - 1];
      array[i - 1] = temp;
    }
  }

  // Creating name
  let name = array[0];
  for (let i = 1; i < array.length; i++) {
    name = name + ', ' + array[i];
  }

  // Creating members array
  const membersArray = [];
  membersArray[0] = ownerId;
  for (let i = 0; i < uId.length; i++) {
    membersArray[i + 1] = uId[i];
  }

  // Creating dm
  data.dms.push({
    dmId: data.dms.length,
    name: name,
    owner: ownerId,
    members: membersArray,
    messages: [],
  });

  setData(data);
  return { dmId: data.dms.length - 1 };
}

function dmListv1(token: string) {
  const data = getData();

  // Checking if token is valid
  if (isValidToken(token) === false) {
    return { error: 'error' };
  }

  const id = getUserId(token);
  const array = [];

  // Storing all relevant dms in array
  for (const Dms of data.dms) {
    for (const uids of Dms.members) {
      if (uids === id) {
        array.push({
          dmId: Dms.dmId,
          name: Dms.name,
        });
      }
    }
  }

  return { dms: array };
}

function dmRemovev1(token: string, dmId: number) {
  const data = getData();

  // Checking if token is valid
  if (isValidToken(token) === false) {
    return { error: 'error' };
  }

  // Checking if dmId is valid
  if (isDmValid(dmId) === false) {
    return { error: 'error' };
  }

  // Checking that token user is apart of dm
  const userId = getUserId(token);
  if (isDmMember(userId, dmId) === false) {
    return { error: 'error' };
  }

  // Checking that the token belongs to the owner
  if (data.dms[dmId].owner !== userId) {
    return { error: 'error' };
  }

  let found = false;
  for (let i = 0; i < data.dms.length - 1; i++) {
    if (data.dms[i].dmId === dmId) {
      found = true;
    }
    if (found === true) {
      data.dms[i] = data.dms[i + 1];
    }
  }
  data.dms[dmId].members.pop();

  setData(data);
  return {};
}

function dmDetailsv1(token: string, dmId: number) {
  const data = getData();

  // Checking if token is valid
  if (isValidToken(token) === false) {
    return { error: 'error' };
  }

  // Checking if dmId is valid
  if (isDmValid(dmId) === false) {
    return { error: 'error' };
  }

  // Checking that token user is apart of dm
  const userId = getUserId(token);
  if (isDmMember(userId, dmId) === false) {
    return { error: 'error' };
  }

  // Creating array of users
  const memberArray = [];

  for (const uids of data.dms[dmId].members) {
    memberArray.push({
      uId: data.users[uids].uId,
      email: data.users[uids].email,
      nameFirst: data.users[uids].nameFirst,
      nameLast: data.users[uids].nameLast,
      handleStr: data.users[uids].handleStr,
    });
  }

  return {
    name: data.dms[dmId].name,
    members: memberArray,
  };
}

function dmLeavev1(token: string, dmId: number) {
  const data = getData();

  // Checking if token is valid
  if (isValidToken(token) === false) {
    return { error: 'error' };
  }

  // Checking if dmId is valid
  if (isDmValid(dmId) === false) {
    return { error: 'error' };
  }

  // Checking that token user is apart of dm
  const userId = getUserId(token);
  if (isDmMember(userId, dmId) === false) {
    return { error: 'error' };
  }

  let found = false;
  for (let i = 0; i < data.dms[dmId].members.length - 1; i++) {
    if (data.dms[dmId].members[i] === userId) {
      found = true;
    }
    if (found === true) {
      data.dms[dmId].members[i] = data.dms[dmId].members[i + 1];
    }
  }
  data.dms[dmId].members.pop();

  setData(data);
  return {};
}

function dmMessagesv1(token: string, dmId: number, start: number) {
  const data = getData();

  // Checking if token is valid
  if (isValidToken(token) === false) {
    return { error: 'error' };
  }

  // Checking if dmId is valid
  if (isDmValid(dmId) === false) {
    return { error: 'error' };
  }

  // Checking that token user is apart of dm
  const userId = getUserId(token);
  if (isDmMember(userId, dmId) === false) {
    return { error: 'error' };
  }

  // Checking that start is less than the number of messages in dms
  if (start > data.dms[dmId].messages.length) {
    return { error: 'error' };
  }

  const messages = [];
  for (let i = start; i < start + 50 && i < data.dms[dmId].messages.length; i++) {
    messages.push(data.dms[dmId].messages[i]);
  }

  let end = start + 50;
  if (start + 50 >= data.dms[dmId].messages.length) {
    end = -1;
  }

  return {
    messages: messages,
    start: start,
    end: end,
  };
}

export {
  dmCreatev1,
  dmListv1,
  dmRemovev1,
  dmDetailsv1,
  dmLeavev1,
  dmMessagesv1
};
