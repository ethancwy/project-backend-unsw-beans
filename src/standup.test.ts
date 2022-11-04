import {
  authRegister, authLogout, channelsCreate, channelInvite,
  clear, messageSend, channelLeave, standupStart, sleep,
  channelMessages, userProfile, standupActive, standupSend
} from './global';

type userType = {
  token?: string;
  authUserId?: number;
}

const requestTime = () => Math.floor((new Date()).getTime() / 1000);

// const sleep1 = async (milliseconds) => {
//   await new Promise(resolve => {
//     return setTimeout(resolve, milliseconds)
//   });
// };

// const testSleep = async (token: string, length: number, channelId: number) => {
//   await sleep1(length * 1000);
//   return channelMessages(token, channelId, 0);
// }

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
    expect(standupStart(globalOwnerId.token, channel.channelId, 5)).toEqual({
      timeFinish: timeNow + 5,
    });

  });

  // test('error 403: invalid token', () => {
  //   const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
  //   authLogout(globalOwnerId.token);
  //   expect(standupStart(globalOwnerId.token, channel.channelId, 5)).toEqual(403);
  // });

  test('error 400: invalid channelId', () => {
    expect(standupStart(globalOwnerId.token, channel.channelId + 1, 5)).toEqual(400);
  });

  test('error 400: negative length', () => {
    expect(standupStart(globalOwnerId.token, channel.channelId, -1)).toEqual(400);
  });

  test('error 400: active standup currently running', () => {
    standupStart(globalOwnerId.token, channel.channelId, 5);
    expect(standupStart(globalOwnerId.token, channel.channelId, 5)).toEqual(400);
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
    globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    channel = channelsCreate(globalOwnerId.token, 'testingStandup', true);
  });

  test('success with active standup', () => {
    const timeFinish = standupStart(globalOwnerId.token, channel.channelId, 1);
    expect(standupActive(globalOwnerId.token, channel.channelId)).toEqual({
      isActive: true,
      timeFinish: timeFinish.timeFinish,
    });
  });

  test('success with inactive standup', () => {
    expect(standupActive(globalOwnerId.token, channel.channelId)).toEqual({
      isActive: false,
      timeFinish: null,
    });
  });

  // test('error 403: invalid token', () => {
  //   authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
  //   authLogout(globalOwnerId.token);
  //   expect(standupActive(globalOwnerId.token, channel.channelId)).toEqual(403);
  // });

  test('error 400: invalid channelId', () => {
    expect(standupActive(globalOwnerId.token, channel.channelId + 1)).toEqual(400);
  });

  test('error 403: Authorised user not member of channel', () => {
    const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    standupStart(globalOwnerId.token, channel.channelId, 1);
    expect(standupActive(random.token, channel.channelId)).toEqual(403);
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
    // const owner = userProfile(globalOwnerId.token, globalOwnerId.authUserId);
    // const handle = owner.user.handleStr;
    standupStart(globalOwnerId.token, channel.channelId, 2);
    expect(standupSend(globalOwnerId.token, channel.channelId, 'hello')).toEqual({});
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

  // test('error 403: invalid token', () => {
  //   // authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
  //   standupStart(globalOwnerId.token, channel.channelId, 1);
  //   // authLogout(globalOwnerId.token);
  //   expect(standupSend(globalOwnerId.token + 'hi', channel.channelId, 'hello')).toEqual(403);
  // });

  test('error 400: invalid channelId', () => {
    standupStart(globalOwnerId.token, channel.channelId, 1);
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

  test('error 400: no active standup running', () => {
    expect(standupSend(globalOwnerId.token, channel.channelId, 'hello')).toEqual(400);
  });

  test('error 403: authorised user not member of channel', () => {
    const random = authRegister('Nina0803@icloud.com', 'Nina0803', 'Nina', 'Yeh');
    standupStart(globalOwnerId.token, channel.channelId, 3);
    expect(standupSend(random.token, channel.channelId, 'hello')).toEqual(403);
  });
});

