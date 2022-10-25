import { authLogin, authRegister, authLogout, clear } from './global';

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
    expect(person1 === person2).toBe(false);
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

  // Invalid email
  test('Testing for invalid register: Invalid email', () => {
    expect(authRegister('Invalid email', 'Bob100', 'Peter', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid register: Invalid email', () => {
    expect(authRegister('', 'Bob100', 'Peter', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  // Email already used
  test('Testing for already used email in first test', () => {
    expect(authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  // Invalid password
  test('Testing for invalid password: Invalid password', () => {
    expect(authRegister('p.file@gmail.com', '123', 'Peter', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid password: Invalid password', () => {
    expect(authRegister('p.file@gmail.com', '', 'Peter', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  // Invalid first name
  test('Testing for invalid name: Invalid first name', () => {
    expect(authRegister('p.file@gmail.com', 'Bob100',
      'Thisnameis50characterstoolongandwillprobablyfail123', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid name: Invalid first name', () => {
    expect(authRegister('p.file@gmail.com', 'Bob100', '', 'File'))
      .toStrictEqual({ error: 'error' });
  });

  // Invalid last name
  test('Testing for invalid name: Invalid last name', () => {
    expect(authRegister('p.file@gmail.com', 'Bob100', 'Peter',
      'Thisnameis50characterstoolongandwillprobablyfail123'))
      .toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid name: Invalid last name', () => {
    expect(authRegister('p.file@gmail.com', 'Bob100', 'Peter', ''))
      .toStrictEqual({ error: 'error' });
  });
});

describe('Testing for authLoginV2: ', () => {
  // Valid login
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
    // const user = authLogin('p.file@gmail.com', 'Bob100');
    expect(authLogout(user.token)).toStrictEqual({});
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
    // const user = authLogin('p.file@gmail.com', 'Bob100');
    expect(authLogout(user.token)).toStrictEqual({});
    expect(authLogout(user.token)).toStrictEqual({ error: 'error' });
  });

  test('Testing for invalid logout', () => {
    clear();
    const user = authRegister('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    const user1 = authRegister('m.hunt@gmail.com', 'Bob100', 'Mike', 'Hunt');
    // const user = authLogin('p.file@gmail.com', 'Bob100');
    // const user1 = authLogin('m.hunt@gmail.com', 'Bob100');
    expect(authLogout(user.token)).toStrictEqual({});
    expect(authLogout(user.token)).toStrictEqual({ error: 'error' });
    expect(authLogout(user1.token)).toStrictEqual({});
    expect(authLogout(user1.token)).toStrictEqual({ error: 'error' });
  });
});
clear();
