import {
  authRegister, channelsCreate, channelInvite,
  clear, messageSend, channelLeave, standupStart
} from './global';

type userType = {
  token?: string;
  authUserId?: number;
}

const requestTime = () => Math.floor((new Date()).getTime() / 1000);

// Tests for /standup/start/v1
describe('/standup/start/v1 ', () => {
  let globalOwnerId: userType;
  let channel: { channelId: number };
  beforeEach(() => {
    clear();
    globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    channel = channelsCreate(globalOwnerId.token, 'testingStandup', true);
  });

  test('success', () => {
    const timeNow = requestTime();
    expect(standupStart(globalOwnerId.token, channel.channelId, 10)).toStrictEqual({
      timeFinish: timeNow + 10,
    });
  });

  test('error 400: invalid channelId', () => {
    expect(standupStart(globalOwnerId.token, channel.channelId + 1, 10)).toStrictEqual(400);
  });

  test('error 400: negative length', () => {
    expect(standupStart(globalOwnerId.token, channel.channelId, -1)).toStrictEqual(400);
  });

  test('error 400: active standup currently running', () => {
    standupStart(globalOwnerId.token, channel.channelId, 10);
    expect(standupStart(globalOwnerId.token, channel.channelId, 5)).toStrictEqual(400);
  });

  test('error 403: authorised user not a member of channel', () => {
    const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    expect(standupStart(random.token, channel.channelId, 10)).toStrictEqual(403);
  });

});