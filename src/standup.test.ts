import {
  authRegister, channelsCreate, channelInvite,
  clear, messageSend, channelLeave, standupStart, sleep,
  channelMessages, userProfile
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

// Tests for /standup/active/v1
describe('/standup/active/v1 ', () => {
  let globalOwnerId: userType;
  let channel: { channelId: number };
  beforeEach(() => {
    clear();
    globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    channel = channelsCreate(globalOwnerId.token, 'testingStandup', true);
  });

  test('success with active standup', () => {
    const timeFinish = standupStart(globalOwnerId.token, channel.channelId, 10);
    expect(standupActive(globalOwnerId.token, channel.channelId)).toStrictEqual({
      isActive: true,
      timeFinish: timeFinish.timeFinish,
    });
  });

  test('success with inactive standup', () => {
    expect(standupActive(globalOwnerId.token, channel.channelId)).toStrictEqual({
      isActive: false,
      timeFinish: null,
    });
  });

  test('error 400: invalid channelId', () => {
    standupStart(globalOwnerId.token, channel.channelId, 10);
    expect(standupActive(globalOwnerId.token, channel.channelId + 1)).toStrictEqual(400);
  });

  test('error 403: Authorised user not member of channel', () => {
    standupStart(globalOwnerId.token, channel.channelId, 10);
    const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    expect(standupActive(random.token, channel.channelId)).toStrictEqual(403);
  });

});

describe('/standup/send/v1 ', () => {
  let globalOwnerId: userType;
  let channel: { channelId: number };
  beforeEach(() => {
    clear();
    globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    channel = channelsCreate(globalOwnerId.token, 'testingStandup', true);
  });

  test('success send', () => {
    const owner = userProfile(globalOwnerId.token, globalOwnerId.authUserId);
    const handle = owner.user.handleStr;
    standupStart(globalOwnerId.token, channel.channelId, 10);
    expect(standupSend(globalOwnerId.token, channel.channelId, 'hello')).toStrictEqual({});
    // sleep(10000);
    // expect(channelMessages(globalOwnerId.token, channel.channelId, 0)).toStrictEqual({
    //   messages: [
    //     {
    //       messageId: messageId.messageId,
    //       uId: globalOwnerId.authUserId,
    //       message: `${handle}: hello`,
    //       timeSent: expect.any(Number),
    //       reacts: [],
    //       isPinned: false,
    //     }
    //   ],
    //   start: 0,
    //   end: -1,
    // });
  });

  test('error 400: invalid channelId', () => {
    standupStart(globalOwnerId.token, channel.channelId, 10);
    expect(standupSend(globalOwnerId.token, channel.channelId + 1, 'hello')).toStrictEqual(400);
  });

  test('error 400: message over 1000 characters', () => {
    standupStart(globalOwnerId.token, channel.channelId, 10);
    expect(standupSend(globalOwnerId.token, channel.channelId, `dsasdasdasdasda
    dsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadas
    dsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadas
    dsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadas
    dsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadas
    dsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadas
    dsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadas
    dsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadas
    dsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadas
    dsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadas
    dsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadas
    dsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadas
    dsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadasdsdsasdsdasddsdsadasdadas
    dsdsasdsdasddsdsadasd`)).toStrictEqual(400);
  });

  test('error 400: no active standup running', () => {
    expect(standupSend(globalOwnerId.token, channel.channelId, 'hello')).toStrictEqual(400);
  });

  test('error 403: authorised user not member of channel', () => {
    standupStart(globalOwnerId.token, channel.channelId, 10);
    const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    expect(standupSend(random.token, channel.channelId, 'hello')).toStrictEqual(403);
  });
});