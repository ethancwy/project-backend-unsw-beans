import {
  authRegister, channelsCreate,
  clear, standupStart,
  channelMessages, userProfile, standupActive, standupSend
} from './global';

type userType = {
  token: string;
  authUserId: number;
}

const requestTime = () => Math.floor((new Date()).getTime() / 1000);

const wait = () => {
  let sum = 0;
  for (let i = 0; i < 30000; i++) {
    for (let j = 0; j < 30000; j++) {
      sum += i + j;
    }
  }
  return sum;
};

clear();

// Tests for /standup/start/v1
describe('/standup/start/v1 ', () => {
  let globalOwnerId: userType;
  let channel: { channelId: number };
  beforeEach(() => {
    clear();
    jest.useFakeTimers();
    // wait();
    globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    channel = channelsCreate(globalOwnerId.token, 'testingStandup', true);
  });

  afterEach(() => {
    jest.runAllTimers();
  });

  test('success', () => {
    const timeNow = requestTime();
    const time = standupStart(globalOwnerId.token, channel.channelId, 2);
    expect(time.timeFinish).toBeGreaterThanOrEqual(timeNow + 2);
    expect(time.timeFinish).toBeLessThanOrEqual(timeNow + 3);
  });

  test('error 403: invalid token', () => {
    expect(standupStart(globalOwnerId.token + 'hi', channel.channelId, 2)).toEqual(403);
  });

  test('error 400: invalid channelId', () => {
    expect(standupStart(globalOwnerId.token, channel.channelId + 1, 2)).toEqual(400);
  });

  test('error 400: negative length', () => {
    expect(standupStart(globalOwnerId.token, channel.channelId, -1)).toEqual(400);
  });

  test('error 400: active standup currently running', () => {
    standupStart(globalOwnerId.token, channel.channelId, 2);
    expect(standupStart(globalOwnerId.token, channel.channelId, 2)).toEqual(400);
  });

  test('error 403: authorised user not a member of channel', () => {
    const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    expect(standupStart(random.token, channel.channelId, 5)).toEqual(403);
  });
});

// Tests for /standup/active/v1
describe('/standup/active/v1 ', () => {
  let globalOwnerId: userType;
  let channel: { channelId: number };
  beforeEach(() => {
    clear();
    jest.useFakeTimers();
    globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    channel = channelsCreate(globalOwnerId.token, 'testingStandup', true);
  });

  afterEach(() => {
    jest.runAllTimers();
  });

  test('success with active standup', () => {
    const timeFinish: { timeFinish: number } = standupStart(globalOwnerId.token, channel.channelId, 3);
    expect(standupActive(globalOwnerId.token, channel.channelId)).toEqual({
      isActive: true,
      timeFinish: timeFinish.timeFinish,
    });
  });
  test('error 400: invalid channelId', () => {
    standupStart(globalOwnerId.token, channel.channelId, 1);
    expect(standupActive(globalOwnerId.token, channel.channelId + 1)).toEqual(400);
  });

  test('error 403: invalid token', () => {
    standupStart(globalOwnerId.token, channel.channelId, 1);
    // authLogout(globalOwnerId.token);
    expect(standupActive(globalOwnerId.token + 'hi', channel.channelId)).toEqual(403);
  });

  test('error 403: Authorised user not member of channel', () => {
    const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    standupStart(globalOwnerId.token, channel.channelId, 1);
    expect(standupActive(random.token, channel.channelId)).toEqual(403);
  });

  test('success with inactive standup', () => {
    expect(standupActive(globalOwnerId.token, channel.channelId)).toEqual({
      isActive: false,
      timeFinish: null,
    });
  });
});
// jest.useRealTimers();
// jest.useFakeTimers();
// try timeout

describe('/standup/send/v1 ', () => {
  let globalOwnerId: userType;
  let channel: { channelId: number };
  beforeEach(() => {
    clear();
    jest.useFakeTimers();
    // wait();
    globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    channel = channelsCreate(globalOwnerId.token, 'testingStandup', true);
  });

  afterEach(() => {
    jest.runAllTimers();
  });
  test('success send', () => {
    const owner = userProfile(globalOwnerId.token, globalOwnerId.authUserId);
    const handle1 = owner.user.handleStr;
    standupStart(globalOwnerId.token, channel.channelId, 5);
    expect(standupSend(globalOwnerId.token, channel.channelId, 'hellothere!')).toEqual({});
    expect(standupSend(globalOwnerId.token, channel.channelId, 'bye!')).toEqual({});

    wait();
    expect(channelMessages(globalOwnerId.token, channel.channelId, 0)).toEqual({
      messages: [
        {
          messageId: expect.any(Number),
          uId: globalOwnerId.authUserId,
          message: `${handle1}: hellothere!\n${handle1}: bye!`,
          timeSent: expect.any(Number),
          reacts: [],
          isPinned: false,
        }
      ],
      start: 0,
      end: -1
    });
  });
  test('success send empty string', () => {
    standupStart(globalOwnerId.token, channel.channelId, 3);
    expect(standupSend(globalOwnerId.token, channel.channelId, '')).toEqual({});
  });

  test('error 400: no active standup running', () => {
    expect(standupSend(globalOwnerId.token, channel.channelId, 'hello')).toEqual(400);
  });
  test('error 400: invalid channelId', () => {
    standupStart(globalOwnerId.token, channel.channelId, 2);
    expect(standupSend(globalOwnerId.token, channel.channelId + 1, 'hello')).toEqual(400);
  });

  test('error 400: message over 1000 characters', () => {
    standupStart(globalOwnerId.token, channel.channelId, 1);
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
    dsdsasdsdasddsdsadasd`)).toEqual(400);
  });

  test('error 403: authorised user not member of channel', () => {
    const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    standupStart(globalOwnerId.token, channel.channelId, 3);
    expect(standupSend(random.token, channel.channelId, 'hello')).toEqual(403);
  });

  test('error 403: invalid token', () => {
    standupStart(globalOwnerId.token, channel.channelId, 1);
    expect(standupSend(globalOwnerId.token + 'hi', channel.channelId, 'hello')).toEqual(403);
  });
});
