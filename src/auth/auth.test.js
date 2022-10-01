import { authLoginV1, authRegisterV1 } from'./auth';

describe('Testing for authRegisterV1: ', ()=> {
  // Valid register
  test('Testing for valid register', ()=> {
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File')).toStrictEqual(
      {
        authUserId: expect.any(Number)
      });
  });

  // Invalid email
  test('Testing for invalid register: Invalid email', ()=> {
    expect(authRegisterV1(123, 'Bob100', 'Peter', 'File')).toStrictEqual({ error: 'error'});
  });

  test('Testing for invalid register: Invalid email', ()=> {
    expect(authRegisterV1('', 'Bob100', 'Peter', 'File')).toStrictEqual({ error: 'error'});
  });


  // Invalid password
  test('Testing for invalid password: Invalid password', ()=> {
    expect(authRegisterV1('p.file@gmail.com', 123, 'Peter', 'File')).toStrictEqual({ error: 'error'});
  });

  test('Testing for invalid password: Invalid password', ()=> {
    expect(authRegisterV1('p.file@gmail.com', '', 'Peter', 'File')).toStrictEqual({ error: 'error'});
  });

  // Invalid first name
  test('Testing for invalid name: Invalid first name', ()=> {
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', 123, 'File')).toStrictEqual({ error: 'error'});
  });

  test('Testing for invalid name: Invalid first name', ()=> {
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', '', 'File')).toStrictEqual({ error: 'error'});
  });

  // Invalid last name
  test('Testing for invalid name: Invalid last name', ()=> {
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 123)).toStrictEqual({ error: 'error'});
  });

  test('Testing for invalid name: Invalid last name', ()=> {
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', '')).toStrictEqual({ error: 'error'});
  });

});



describe('Testing for authLoginV1: ', ()=> {
  // Valid login
  test('Testing for Valid login: ', ()=> {
    expect(authLoginV1('p.file@gmail.com', 'Bob100')).toStrictEqual(
      {
        authUserId: expect.any(Number)
      });
  });


  // Invalid email
  test('Testing for invalid login email: Invalid email', ()=> {
    expect(authLoginV1(123, 'Bob100')).toStrictEqual({ error: 'error');
  });

  test('Testing for invalid login email: Invalid email', ()=> {
    expect(authLoginV1('', 123)).toStrictEqual({ error: 'error'});
  });

  // Invalid password
  test('Testing for invalid login password: Invalid password', ()=> {
    expect(authLoginV1('p.file@gmail.com', 123)).toStrictEqual({ error: 'error'});
  });

  test('Testing for invalid login password: Invalid password', ()=> {
    expect(authLoginV1('p.file@gmail.com', '')).toStrictEqual({ error: 'error'});
  });

});