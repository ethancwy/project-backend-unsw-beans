import { authLogin, authRegister, authLogout, clear, channelsCreate } from './global';

// =================================================== //
//                                                     //
//              AUTH FUNCTION TESTS                    //
//                                                     //
// ==================================================  //
clear();

describe('Testing for authRegisterV2: ', () => {
  clear();
  // Valid register
  test('Testing for valid register', () => {
    expect(authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File'))
      .toStrictEqual(
        {
          token: expect.any(String),
          authUserId: expect.any(Number)
        });
  });

  // Valid register, 2 person different token
  test('Testing for valid register', () => {
    clear();
    const person1 = authRegister('p.file111@gmail.com', 'Bob1002', 'Peter23', 'File23');
    const person2 = authRegister('p12.file@gmail.com', 'Bob1001', 'Peter12', 'File12');
    expect(person1.token === person2.token).toBe(false);
    expect(person1)
      .toStrictEqual(
        {
          token: expect.any(String),
          authUserId: expect.any(Number)
        });
  });

  // Valid register, same name after clear
  test('Testing for valid register', () => {
    authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    clear();
    expect(authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File'))
      .toStrictEqual(
        {
          token: expect.any(String),
          authUserId: expect.any(Number)
        });
  });
});

describe('Error checking authRegisterV2 ', () => {
  clear();
  // Invalid emails
  test.each([
    { email: 'peter@file@hehe.com', password: 'password', nameFirst: 'Peter', nameLast: 'File' },
    { email: 'peter', password: 'password', nameFirst: 'Peter', nameLast: 'File' },
    { email: '@hotmail.com', password: 'password', nameFirst: 'Peter', nameLast: 'File' },
    { email: '', password: 'password', nameFirst: 'Peter', nameLast: 'File' },
  ])('Testing invalid emails', ({ email, password, nameFirst, nameLast }) => {
    expect(authRegister(email, password, nameFirst, nameLast)).toStrictEqual({ error: 'error' });
  });

  // Email already used
  test('Testing for duplicate email', () => {
    clear();
    authRegister('p.file@gmail.com', 'Bob1002', 'Peter23', 'File23');
    expect(authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  // Invalid password
  clear();
  test.each([
    { email: 'p.file@gmail.com', password: '12345', nameFirst: 'Peter', nameLast: 'File' },
    { email: 'p.file@gmail.com', password: '', nameFirst: 'Peter', nameLast: 'File' },
  ])('Testing invalid passwords', ({ email, password, nameFirst, nameLast }) => {
    expect(authRegister(email, password, nameFirst, nameLast)).toStrictEqual({ error: 'error' });
  });

  // Invalid first name
  clear();
  test.each([
    {
      email: 'p.file@gmail.com',
      password: '123456',
      nameFirst: 'Thisnameis50characterstoolongandwillprobablyfail123',
      nameLast: 'File'
    },
    { email: 'p.file@gmail.com', password: '123456', nameFirst: '', nameLast: 'File' },
  ])('Testing invalid nameFirst', ({ email, password, nameFirst, nameLast }) => {
    expect(authRegister(email, password, nameFirst, nameLast)).toStrictEqual({ error: 'error' });
  });

  // Invalid last name
  clear();
  test.each([
    {
      email: 'p.file@gmail.com',
      password: '123456',
      nameFirst: 'Peter',
      nameLast: 'Thisnameis50characterstoolongandwillprobablyfail123'
    },
    { email: 'p.file@gmail.com', password: '123456', nameFirst: 'Peter', nameLast: '' },
  ])('Testing invalid nameLast', ({ email, password, nameFirst, nameLast }) => {
    expect(authRegister(email, password, nameFirst, nameLast)).toStrictEqual({ error: 'error' });
  });
});

// Valid login
describe('Testing for authLoginV2: ', () => {
  test('Testing for Valid login: ', () => {
    clear();
    authRegister('p.file@gmail.com', 'Bob100',
      'Peter', 'File');
    expect(authLogin('p.file@gmail.com', 'Bob100')).toStrictEqual(
      {
        token: expect.any(String),
        authUserId: expect.any(Number)
      });
  });

  // Valid login same user 2nd session
  test('Testing for Valid login: ', () => {
    clear();
    const session1 = authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const session2 = authLogin('p.file@gmail.com', 'Bob100');
    expect(session1.token === session2.token).toBe(false);
    expect(session1.authuserId === session2.authuserId).toBe(true);
  });
});

describe('Error checking authLoginV2: ', () => {
  // unregistered user
  test('Testing for unregistered user', () => {
    clear();
    expect(authLogin('p.file@gmail.com', 'Bob100'))
      .toStrictEqual({ error: 'error' });
  });

  // Invalid email
  test('Testing for invalid login email: Invalid email', () => {
    clear();
    authRegister('p.file@gmail.com', 'Bob100',
      'Peter', 'File');
    expect(authLogin('invalid email', 'Bob100'))
      .toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid login email: Invalid email', () => {
    clear();
    authRegister('p.file@gmail.com', 'Bob100',
      'Peter', 'File');
    expect(authLogin('', 'Bob100')).toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid login email: Does not belong to user', () => {
    clear();
    authRegister('p.file@gmail.com', 'Bob100',
      'Peter', 'File');
    authRegister('terry@gmail.com', 'Password',
      'Terry', 'File');
    expect(authLogin('p.file@gmail.com', 'Password')).toStrictEqual({ error: 'error' });
  });

  //  Invalid password
  test('Testing for invalid login password: Invalid password', () => {
    clear();
    authRegister('p.file@gmail.com', 'Bob100',
      'Peter', 'File');
    expect(authLogin('p.file@gmail.com', 'bob10'))
      .toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid login password: Invalid password', () => {
    clear();
    authRegister('p.file@gmail.com', 'Bob100',
      'Peter', 'File');
    expect(authLogin('p.file@gmail.com', '')).toStrictEqual({ error: 'error' });
  });
});

describe('Testing for auth/logout/v1', () => {
  // Valid logout
  test('Testing for valid logout', () => {
    clear();
    const user = authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File');

    expect(authLogout(user.token)).toStrictEqual({});
  });

  test('Testing for 2 sessions', () => {
    clear();
    const session1 = authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File');

    const session2 = authLogin('p.file@gmail.com', 'Bob100');
    expect(session1.token !== session2.token).toBe(true);
    // authLogout(session2.token);
    // expect(channelsCreate(session1.token, 'hiii', true)).toStrictEqual({ channelId: expect.any(Number) });
    expect(channelsCreate(session2.token, 'hii', true)).toStrictEqual({ channelId: expect.any(Number) });
  });

  // Invalid token
  test('Testing for invalid logout', () => {
    clear();
    authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    expect(authLogout('token')).toStrictEqual({ error: 'error' });
  });

  // Invalid logout (logout twice)
  test('Testing for invalid logout', () => {
    clear();
    const user = authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File');

    expect(authLogout(user.token)).toStrictEqual({});
    expect(authLogout(user.token)).toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid logout', () => {
    clear();
    const user = authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const user1 = authRegister('m.hunt@gmail.com', 'Bob100', 'Mike', 'Hunt');

    expect(authLogout(user.token)).toStrictEqual({});
    expect(authLogout(user.token)).toStrictEqual({ error: 'error' });
    expect(authLogout(user1.token)).toStrictEqual({});
    expect(authLogout(user1.token)).toStrictEqual({ error: 'error' });
    clear();
  });
});
