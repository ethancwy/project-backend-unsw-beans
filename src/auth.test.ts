import { authLoginV1, authRegisterV1 } from './auth';
import request from 'sync-request';
import { postRequest } from './global';
import { clearV1 } from './other';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;


// =================================================== //
//                                                     //
//              AUTH FUNCTION WRAPPER                  //
//                                                     //
// ==================================================  //

describe('Testing /auth/register/v2', () => {
  test('/auth/register/v2 success', () => {
    const register = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'p.file@gmail.com',
      password: 'Bob100',
      nameFirst: 'Peter',
      nameLast: 'File',
    });

    expect(register).toStrictEqual({ 
      authUserId: expect.any(Number),
      token: expect.any(String)
    });
  });

  test('/auth/register/v2 invalid email', () => {
    const register = postRequest(SERVER_URL + '//auth/register/v2', {
      email: 'Invalid email',
      password: 'Bob100',
      nameFirst: 'Peter',
      nameLast: 'File',
    });

    expect(register).toStrictEqual({ error: 'error' });
  });

  test('/auth/register/v2 invalid email', () => {
    const register = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'Invalid email',
      password: 'Bob100',
      nameFirst: 'Peter',
      nameLast: 'File',
    });

    expect(register).toStrictEqual({ error: 'error' });
  });

  test('/auth/register/v2 invalid email', () => {
    const register = postRequest(SERVER_URL + '/auth/register/v2', {
      email: '',
      password: 'Bob100',
      nameFirst: 'Peter',
      nameLast: 'File',
    });

    expect(register).toStrictEqual({ error: 'error' });
  });

  test('/auth/register/v2 password', () => {
    const register = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'p.file@gmail.com',
      password: '123',
      nameFirst: 'Peter',
      nameLast: 'File',
    });

    expect(register).toStrictEqual({ error: 'error' });
  });

  test('/auth/register/v2 password', () => {
    const register = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'p.file@gmail.com',
      password: '',
      nameFirst: 'Peter',
      nameLast: 'File',
    });

    expect(register).toStrictEqual({ error: 'error' });
  });

  test('/auth/register/v2 first name', () => {
    const register = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'p.file@gmail.com',
      password: 'Bob100',
      nameFirst: 'Thisnameis50characterstoolongandwillprobablyfail123',
      nameLast: 'File',
    });

    expect(register).toStrictEqual({ error: 'error' });
  });

  test('/auth/register/v2 first name', () => {
    const register = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'p.file@gmail.com',
      password: 'Bob100',
      nameFirst: '',
      nameLast: 'File',
    });

    expect(register).toStrictEqual({ error: 'error' });
  });

  test('/auth/register/v2 last name', () => {
    const register = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'p.file@gmail.com',
      password: 'Bob100',
      nameFirst: 'Peter',
      nameLast: 'Thisnameis50characterstoolongandwillprobablyfail123',
    });

    expect(register).toStrictEqual({ error: 'error' });
  });

  test('/auth/register/v2 last name', () => {
    const register = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'p.file@gmail.com',
      password: 'Bob100',
      nameFirst: 'Peter',
      nameLast: 'Thisnameis50characterstoolongandwillprobablyfail123',
    });

    expect(register).toStrictEqual({ error: 'error' });
  });
});

describe('Testing for /auth/login/v2', () => {
  test('/auth/login/v2 success', () => {
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const login = postRequest(SERVER_URL + '/auth/login/v2', {
      email: 'p.file@gmail.com',
      password: 'Bob100',
    });

    expect(login).toStrictEqual({ 
      authUserId: expect.any(Number),
      token: expect.any(String)
    });
  });

  test('/auth/login/v2 invalid  email login', () => {
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const login = postRequest(SERVER_URL + '/auth/login/v2', {
      email: 'invalid email',
      password: 'Bob100',
    });

    expect(login).toStrictEqual({ error: 'error' });
  });

  test('/auth/login/v2 invalid  email login', () => {
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const login = postRequest(SERVER_URL + '/auth/login/v2', {
      email: '',
      password: 'Bob100',
    });

    expect(login).toStrictEqual({ error: 'error' });
  });

  test('/auth/login/v2 invalid  password login', () => {
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const login = postRequest(SERVER_URL + '/auth/login/v2', {
      email: 'p.file@gmail.com',
      password: '123',
    });

    expect(login).toStrictEqual({ error: 'error' });
  });

  test('/auth/login/v2 invalid  password login', () => {
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const login = postRequest(SERVER_URL + '/auth/login/v2', {
      email: 'p.file@gmail.com',
      password: '',
    });

    expect(login).toStrictEqual({ error: 'error' });
  });
});

describe('Testing for /auth/logout/v1', () => {
  test('/auth/logout/v1 success', () => {
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const user = authLoginV1('p.file@gmail.com', 'Bob100');
    const token = user.token;
    const logout = postRequest(SERVER_URL + '/auth/logout/v2', {
      token: user.token,
    });

    expect(logout).toStrictEqual({});
  });

  test('/auth/logout/v1 invalid token', () => {
    clearV1();
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const user = authLoginV1('p.file@gmail.com', 'Bob100');
    const token = 'token';
    const logout = postRequest(SERVER_URL + '/auth/logout/v2', {
      token: user.token,
    });

    expect(logout).toStrictEqual({ error: 'error'});
  });
});

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
    const token = user.token;
    expect(authLogoutV1(user.token)).toStrictEqual({});
  });

  // Invalid token 
  test('Testing for invalid logout', () => {
    clearV1();
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const user = authLoginV1('p.file@gmail.com', 'Bob100');
    const token = user.token;
    expect(authLogoutV1('token')).toStrictEqual({ error: 'error'});
  });

  // Invalid logout (logout twice)
  test('Testing for invalid logout', () => {
    clearV1();
    authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const user = authLoginV1('p.file@gmail.com', 'Bob100');
    const token = user.token;
    expect(authLogoutV1(user.token)).toStrictEqual({});
    expect(authLogoutV1(user.token)).toStrictEqual({ error: 'error'});
  });
});