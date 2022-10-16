import { authLoginV1, authRegisterV1, authLogoutV1 } from './auth';
import { clearV1 } from './other';
import request, { HttpVerb } from 'sync-request';
import { requestHelper } from './global';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

// =================================================== //
//                                                     //
//              AUTH FUNCTION WRAPPERS                 //
//                                                     //
// ==================================================  //

export function authRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  return requestHelper('POST', '/auth/register/v2', { email, password, nameFirst, nameLast });
}

export function authLogin(email: string, password: string) {
  return requestHelper('POST', '/auth/login/v2', { email, password });
}

export function authLogout(token: string) {
  return requestHelper('POST', '/auth/logout/v1', { });
}

// =================================================== //
//                                                     //
//              AUTH FUNCTION TESTS                    //
//                                                     //
// ==================================================  //

describe('Testing for authRegisterV2: ', () => {
  // Valid register
  test('Testing for valid register', () => {
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File'))
      .toStrictEqual(
        {
          authUserId: expect.any(Number),
          token: expect.any(String)
        });
  });

  // Invalid email
  test('Testing for invalid register: Invalid email', () => {
    expect(authRegisterV1('Invalid email', 'Bob100', 'Peter', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid register: Invalid email', () => {
    expect(authRegisterV1('', 'Bob100', 'Peter', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  // Email already used
  test('Testing for already used email in first test', () => {
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  // Invalid password
  test('Testing for invalid password: Invalid password', () => {
    clearV1();
    expect(authRegisterV1('p.file@gmail.com', '123', 'Peter', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid password: Invalid password', () => {
    clearV1();
    expect(authRegisterV1('p.file@gmail.com', '', 'Peter', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  // Invalid first name
  test('Testing for invalid name: Invalid first name', () => {
    clearV1();
    expect(authRegisterV1('p.file@gmail.com', 'Bob100',
      'Thisnameis50characterstoolongandwillprobablyfail123', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid name: Invalid first name', () => {
    clearV1();
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', '', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  // Invalid last name
  test('Testing for invalid name: Invalid last name', () => {
    clearV1();
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter',
      'Thisnameis50characterstoolongandwillprobablyfail123'))
      .toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid name: Invalid last name', () => {
    clearV1();
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', ''))
      .toStrictEqual({ error: 'error' });
  });
});

describe('Testing for authLoginV2: ', () => {
  // Valid login
  test('Testing for Valid login: ', () => {
    clearV1();
    authRegisterV1('p.file@gmail.com', 'Bob100',
      'Peter', 'File');
    expect(authLoginV1('p.file@gmail.com', 'Bob100')).toStrictEqual(
      {
        authUserId: expect.any(Number),
        token: expect.any(String)
      });
  });

  // Invalid email
  test('Testing for invalid login email: Invalid email', () => {
    clearV1();
    authRegisterV1('p.file@gmail.com', 'Bob100',
      'Peter', 'File');
    expect(authLoginV1('invalid email', 'Bob100'))
      .toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid login email: Invalid email', () => {
    clearV1();
    authRegisterV1('p.file@gmail.com', 'Bob100',
      'Peter', 'File');
    expect(authLoginV1('', 'Bob100')).toStrictEqual({ error: 'error' });
  });

  // Invalid password
  test('Testing for invalid login password: Invalid password', () => {
    clearV1();
    authRegisterV1('p.file@gmail.com', 'Bob100',
      'Peter', 'File');
    expect(authLoginV1('p.file@gmail.com', 'bob10'))
      .toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid login password: Invalid password', () => {
    clearV1();
    authRegisterV1('p.file@gmail.com', 'Bob100',
      'Peter', 'File');
    expect(authLoginV1('p.file@gmail.com', '')).toStrictEqual({ error: 'error' });
  });
});

describe('Testing for auth/logout/v1', () => {
  // Valid logout
  test('Testing for valid logout', () => {
    clearV1();
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const user = authLoginV1('p.file@gmail.com', 'Bob100');
    expect(authLogoutV1(user.token)).toStrictEqual({});
  });

  // Invalid token
  test('Testing for invalid logout', () => {
    clearV1();
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    expect(authLogoutV1('token')).toStrictEqual({ error: 'error' });
  });

  // Invalid logout (logout twice)
  test('Testing for invalid logout', () => {
    clearV1();
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const user = authLoginV1('p.file@gmail.com', 'Bob100');
    expect(authLogoutV1(user.token)).toStrictEqual({});
    expect(authLogoutV1(user.token)).toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid logout', () => {
    clearV1();
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    authRegisterV1('m.hunt@gmail.com', 'Bob100', 'Mike', 'Hunt');
    const user = authLoginV1('p.file@gmail.com', 'Bob100');
    const user1 = authLoginV1('m.hunt@gmail.com', 'Bob100');
    expect(authLogoutV1(user.token)).toStrictEqual({});
    expect(authLogoutV1(user.token)).toStrictEqual({ error: 'error' });
    expect(authLogoutV1(user1.token)).toStrictEqual({});
    expect(authLogoutV1(user1.token)).toStrictEqual({ error: 'error' });
  });
});
