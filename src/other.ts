import { getData, setData } from './dataStore';

function clearV1() {
  let data = getData();
  data = {
    users: [],
    channels: [],
    dms: [],
    sessionIds: [],
    messageDetails: [],
    inviteDetails: [],
    counter: 0,
  };
  setData(data);
  return {};
}

export {
  clearV1
};
