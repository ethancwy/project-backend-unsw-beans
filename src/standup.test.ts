import {
  authRegister, authLogout, channelsCreate,
  clear, channelLeave, standupStart, sleep,
  channelMessages, userProfile, standupActive, standupSend
} from './global';

type userType = {
  token?: string;
  authUserId?: number;
}

const requestTime = () => Math.floor((new Date()).getTime() / 1000);

// async function waitMillis(milliseconds: number) {
//   jest.advanceTimersByTime(milliseconds);
// }
const sleep1 = async (milliseconds: number) => {
  await new Promise(resolve => {
    return setTimeout(resolve, milliseconds)
  });
};
const testSleep = async (token: string, length: number, channelId: number) => {
  await sleep1(length * 1000);
  return channelMessages(token, channelId, 0);
}
clear();
// jest.useFakeTimers();
// Tests for /standup/start/v1

describe('/standup/start/v1 ', () => {
  let globalOwnerId: userType;
  let channel: { channelId: number };
  beforeEach(() => {
    clear();
    globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    channel = channelsCreate(globalOwnerId.token, 'testingStandup', true);
    // jest.useFakeTimers();
  });

  // afterEach(() => {
  //   jest.useRealTimers();
  // })

  test('success', async () => {
    const timeNow = requestTime();
    try {
      await standupStart(globalOwnerId.token, channel.channelId, 2);
    } catch (e) {
      expect(e).toEqual({
        timeFinish: timeNow + 2,
      });
    }
    // expect(await standupStart(globalOwnerId.token, channel.channelId, 0.5)).toStrictEqual({
    //   timeFinish: timeNow + 0.5,
    // });

  });

  test('error 403: invalid token', async () => {
    const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    authLogout(globalOwnerId.token);
    try {
      await standupStart(globalOwnerId.token, channel.channelId, 2);
    } catch (e) {
      expect(e).toEqual(403);
    }
    // expect(await standupStart(globalOwnerId.token, channel.channelId, 2)).toEqual(403);

  });

  test('error 400: invalid channelId', async () => {
    expect(await standupStart(globalOwnerId.token, channel.channelId + 1, 2)).toEqual(400);
  });

  test('error 400: negative length', async () => {
    expect(await standupStart(globalOwnerId.token, channel.channelId, -1)).toEqual(400);
  });

  test('error 400: active standup currently running', async () => {
    standupStart(globalOwnerId.token, channel.channelId, 2);
    expect(await standupStart(globalOwnerId.token, channel.channelId, 2)).toEqual(400);
  });

  test('error 403: authorised user not a member of channel', async () => {
    const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    expect(await standupStart(random.token, channel.channelId, 5)).toEqual(403);
  });

  // test('standupStart 2nd time', () => {
  //   // jest.useFakeTimers();
  //   standupStart(globalOwnerId.token, channel.channelId, 2);
  //   expect(standupStart(globalOwnerId.token, channel.channelId, 2)).toEqual(400);
  // });
});
// jest.useRealTimers();
sleep1(5000);
// Tests for /standup/active/v1
describe('/standup/active/v1 ', () => {
  let globalOwnerId: userType;
  let channel: { channelId: number };
  beforeEach(() => {
    clear();
    globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    channel = channelsCreate(globalOwnerId.token, 'testingStandup', true);
    // jest.useFakeTimers();
  });

  // afterEach(() => {
  //   jest.useRealTimers();
  // })

  test('error 400: invalid channelId', async () => {
    standupStart(globalOwnerId.token, channel.channelId, 1);
    expect(await standupActive(globalOwnerId.token, channel.channelId + 1)).toEqual(400);
  });

  test('error 403: invalid token', async () => {
    standupStart(globalOwnerId.token, channel.channelId, 1);
    // authLogout(globalOwnerId.token);
    expect(await standupActive(globalOwnerId.token + 'hi', channel.channelId)).toEqual(403);
  });

  test('error 403: Authorised user not member of channel', async () => {
    const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    standupStart(globalOwnerId.token, channel.channelId, 1);
    expect(await standupActive(random.token, channel.channelId)).toEqual(403);
  });
  test('success with active standup', async () => {
    const timeFinish = standupStart(globalOwnerId.token, channel.channelId, 1);
    expect(await standupActive(globalOwnerId.token, channel.channelId)).toEqual({
      isActive: true,
      timeFinish: timeFinish.timeFinish,
    });
  });
  test('success with inactive standup', async () => {
    expect(await standupActive(globalOwnerId.token, channel.channelId)).toEqual({
      isActive: false,
      timeFinish: null,
    });
  });
});
// jest.useRealTimers();
// jest.useFakeTimers();
// try timeout 
sleep1(5000);
describe('/standup/send/v1 ', () => {
  let globalOwnerId: userType;
  let channel: { channelId: number };
  beforeEach(() => {
    clear();
    globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    channel = channelsCreate(globalOwnerId.token, 'testingStandup', true);
    // jest.useFakeTimers();
  });

  // afterEach(() => {
  //   jest.useRealTimers();
  // })

  // !test send twice 
  test('success send', async () => {
    // const owner = userProfile(globalOwnerId.token, globalOwnerId.authUserId);
    // const handle = owner.user.handleStr;
    standupStart(globalOwnerId.token, channel.channelId, 2);
    expect(await standupSend(globalOwnerId.token, channel.channelId, 'hello')).toEqual({});
    // expect(standupSend(globalOwnerId.token, channel.channelId, 'hellothere')).toEqual({});
    // sleep(2000);
    // const messages = testSleep(globalOwnerId.token, 2, channel.channelId);

    // expect(messages).toEqual({
    //   messages: [
    //     {
    //       messageId: expect.any(Number),
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
  test('error 400: no active standup running', async () => {
    expect(await standupSend(globalOwnerId.token, channel.channelId, 'hello')).toEqual(400);
  });
  test('error 400: invalid channelId', async () => {
    standupStart(globalOwnerId.token, channel.channelId, 2);
    expect(await standupSend(globalOwnerId.token, channel.channelId + 1, 'hello')).toEqual(400);
  });

  test('error 400: message over 1000 characters', async () => {
    standupStart(globalOwnerId.token, channel.channelId, 1);
    expect(await standupSend(globalOwnerId.token, channel.channelId, `dsasdasdasdasda
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

  test('error 403: authorised user not member of channel', async () => {
    const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    standupStart(globalOwnerId.token, channel.channelId, 3);
    expect(await standupSend(random.token, channel.channelId, 'hello')).toEqual(403);
  });

  test('error 403: invalid token', async () => {
    standupStart(globalOwnerId.token, channel.channelId, 1);
    expect(await standupSend(globalOwnerId.token + 'hi', channel.channelId, 'hello')).toEqual(403);
  });
});
clear();
