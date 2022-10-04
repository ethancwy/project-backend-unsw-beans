import {getData, setData} from './dataStore.js';

function clearV1() {
  let data = getData();
  data = {
    users: [
      {
        uId: NaN,
        nameFirst: '',
        nameLast: '',
        email: '',
        password: '',
        handleStr: '',
        isGlobalOwner: false,
      },
    ],

    channels: [
      {
        channelId: NaN,
        name: '',
        isPublic: '',
        ownerIds: [],
        memberIds: [],
        channelmessages: [
          {
            messageId: NaN,
            uId: NaN,
            message: '',
            timeSent: NaN,
          }
        ]
      },
    ],
  };
  setData(data);
  return {};
}
export {
  clearV1,
};