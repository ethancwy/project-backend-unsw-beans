import { authRegister, dmCreate, clear, dmList, dmRmove, dmDetails, dmLeave, dmMessages } from './global';

// Tests for dm/create/v1
describe('Testing dm/create/v1 standard', () => {
  test('Testing function success', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');

    expect(dmCreate(sender.token, [recipient.authUserId])).toStrictEqual({ dmId: expect.any(Number) });
  });
});

describe('Testing errors for dm/create/v1', () => {
  test('uId in uIds array does not refer to valid user', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    let fakeuser = recipient.authUserId;
    if (fakeuser === sender.authUserId) {
      fakeuser++;
    }

    expect(dmCreate(sender.token, [recipient.authUserId, fakeuser])).toStrictEqual({ error: expect.any(String) });
  });

  test('Duplicate uId in uIds array', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');

    expect(dmCreate(sender.token, [recipient.authUserId, recipient.authUserId])).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid token', () => {
    clear();
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const fakeToken = recipient.token + 'sdjf';

    expect(dmCreate(fakeToken, [recipient.authUserId])).toStrictEqual({ error: expect.any(String) });
  });
});

// Tests for dm/list/v1
describe('Testing dm/list/v1 standard', () => {
  test('Testing that function works', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const recipient2 = authRegister('heisenberg@hhm.com', 'bluecrystal', 'Walter', 'White');
    const dm = dmCreate(sender.token, [recipient.authUserId, recipient2.authUserId]);

    expect(dmList(sender.token)).toStrictEqual({
      dms: [{ dmId: dm.dmId, name: expect.any(String) }]
    });
  });
});

describe('Testing dm/list/v1 errors', () => {
  test('Invalid token', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    let fakeToken = sender.token + 'sdf';
    if (fakeToken === recipient.token) {
      fakeToken = fakeToken + 'sdfsd';
    }

    expect(dmList(fakeToken)).toStrictEqual({ error: expect.any(String) });
  });
});

// Tests for dm/leave/v1
describe('Testing dm/leave/v1 standard', () => {
  test('Testing when recipient leaves', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const recipient2 = authRegister('heisenberg@hhm.com', 'bluecrystal', 'Walter', 'White');
    const dm = dmCreate(sender.token, [recipient.authUserId, recipient2.authUserId]);

    expect(dmLeave(recipient.token, dm.dmId)).toStrictEqual({});
  });

  test('Testing when sender leaves', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const recipient2 = authRegister('heisenberg@hhm.com', 'bluecrystal', 'Walter', 'White');
    const dm = dmCreate(sender.token, [recipient.authUserId, recipient2.authUserId]);

    expect(dmLeave(sender.token, dm.dmId)).toStrictEqual({});
  });
});

describe('Testing dm/leave/v1 errors', () => {
  test('Invalid dmId', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const dm = dmCreate(sender.token, [recipient.uId]);

    expect(dmLeave(sender.token, dm.dmId + 1)).toStrictEqual({ error: expect.any(String) });
  });

  test('User is not a member of dm', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const notMember = authRegister('heisenberg@hhm.com', 'bluecrystal', 'Walter', 'White');
    const dm = dmCreate(sender.token, [recipient.authUserId]);

    expect(dmLeave(notMember.token, dm.dmId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid token', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const dm = dmCreate(sender.token, [recipient.authUserId]);
    let fakeToken = sender.token + 'sdf';
    if (fakeToken === recipient.token) {
      fakeToken = fakeToken + 'sdfsd';
    }

    expect(dmLeave(fakeToken, dm.dmId)).toStrictEqual({ error: expect.any(String) });
  });
});

// Tests for dm/remove/v1
describe('Testing dm/remove/v1 standard', () => {
  test('Testing that function works', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const recipient2 = authRegister('heisenberg@hhm.com', 'bluecrystal', 'Walter', 'White');
    const dm = dmCreate(sender.token, [recipient.authUserId, recipient2.authUserId]);

    expect(dmRmove(sender.token, dm.dmId)).toStrictEqual({});
  });
});

describe('Testing dm/remove/v1 errors', () => {
  test('Invalid dmId', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const dm = dmCreate(sender.token, [recipient.authUserId]);

    expect(dmRmove(sender.token, dm.dmId + 1)).toStrictEqual({ error: expect.any(String) });
  });

  test('Recipient removing dm', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const dm = dmCreate(sender.token, [recipient.authUserId]);

    expect(dmRmove(recipient.token, dm.dmId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Sender removes dm but isnt legible', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const recipient2 = authRegister('heisenberg@hhm.com', 'bluecrystal', 'Walter', 'White');
    const dm = dmCreate(sender.token, [recipient.authUserId, recipient2.authUserId]);
    dmLeave(sender.token, dm.dmId);

    expect(dmRmove(sender.token, dm.dmId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid token', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const dm = dmCreate(sender.token, [recipient.authUserId]);
    let fakeToken = sender.token + 'sdf';
    if (fakeToken === recipient.token) {
      fakeToken = fakeToken + 'sdfsd';
    }

    expect(dmRmove(fakeToken, dm.dmId)).toStrictEqual({ error: expect.any(String) });
  });
});

// Tests for dm/details/v1
describe('Testing dm/details/v1 standard', () => {
  test('Testing that function works', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const recipient2 = authRegister('heisenberg@hhm.com', 'bluecrystal', 'Walter', 'White');
    const dm = dmCreate(sender.token, [recipient.authUserId, recipient2.authUserId]);

    expect(dmDetails(sender.token, dm.dmId)).toStrictEqual({
      name: expect.any(String),
      members: [
        {
          uId: sender.authUserId,
          email: 'pollos@hhm.com',
          nameFirst: 'Gus',
          nameLast: 'Fring',
          handleStr: expect.any(String),
        },
        {
          uId: recipient.authUserId,
          email: 'goodman@hhm.com',
          nameFirst: 'Jimmy',
          nameLast: 'McGill',
          handleStr: expect.any(String),
        },
        {
          uId: recipient2.authUserId,
          email: 'heisenberg@hhm.com',
          nameFirst: 'Walter',
          nameLast: 'White',
          handleStr: expect.any(String),
        },
      ],
    });
  });
});

describe('Testing dm/details/v1 errors', () => {
  test('Invalid dmId', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const dm = dmCreate(sender.token, [recipient.authUserId]);

    expect(dmDetails(sender.token, dm.dmId + 1)).toStrictEqual({ error: expect.any(String) });
  });

  test('User is not a member of dm', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const notMember = authRegister('heisenberg@hhm.com', 'bluecrystal', 'Walter', 'White');
    const dm = dmCreate(sender.token, [recipient.authUserId]);

    expect(dmDetails(notMember.token, dm.dmId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid token', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const dm = dmCreate(sender.token, [recipient.authUserId]);
    let fakeToken = sender.token + 'sdf';
    if (fakeToken === recipient.token) {
      fakeToken = fakeToken + 'sdfsd';
    }

    expect(dmDetails(fakeToken, dm.dmId)).toStrictEqual({ error: expect.any(String) });
  });
});

// Test for dm/messages/v1
describe('Testing dm/messages/v1 standard', () => {
  test('Testing that function works', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const dm = dmCreate(sender.token, [recipient.authUserId]);

    expect(dmMessages(sender.token, dm.dmId, 0)).toStrictEqual({
      messages: [],
      start: 0,
      end: -1,
    });
  });
});

describe('Testing dm/messages/v1 errors', () => {
  test('Invalid dmId', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const dm = dmCreate(sender.token, [recipient.authUserId]);

    expect(dmMessages(sender.token, dm.dmId + 1, 0)).toStrictEqual({ error: expect.any(String) });
  });

  test('User is not a member of dm', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const notMember = authRegister('heisenberg@hhm.com', 'bluecrystal', 'Walter', 'White');
    const dm = dmCreate(sender.token, [recipient.authUserId]);

    expect(dmMessages(notMember.token, dm.dmId, 0)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid token', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const dm = dmCreate(sender.token, [recipient.authUserId]);
    let fakeToken = sender.token + 'sdf';
    if (fakeToken === recipient.token) {
      fakeToken = fakeToken + 'sdfsd';
    }

    expect(dmMessages(fakeToken, dm.dmId, 0)).toStrictEqual({ error: expect.any(String) });
  });

  test('Start is greater than number of messages in dm', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    const dm = dmCreate(sender.token, [recipient.authUserId]);

    expect(dmMessages(recipient.token, dm.dmId, 40)).toStrictEqual({ error: expect.any(String) });
  });
});
