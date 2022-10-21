import { getData, setData } from './dataStore';

function clearV1() {
  let data = getData();
  data = {
    users: [],
    channels: [],
    dms: []
  };
  setData(data);
  return {};
}

export {
  clearV1
};
