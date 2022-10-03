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
    expect(authRegisterV1('Invalid email', 'Bob100', 'Peter', 'File')).toStrictEqual({ error: 'error'});
  });


  // Invalid password
  test('Testing for invalid password: Invalid password', ()=> {
    expect(authRegisterV1('p.file@gmail.com', 'bob10', 'Peter', 'File')).toStrictEqual({ error: 'error'});
  });

  // Invalid first name
  test('Testing for invalid name: Invalid first name', ()=> {
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Thisfirstnameisinvalidandshouldreturnerrorandshouldbemorethan50char', 'File')).toStrictEqual({ error: 'error'});
  });

  test('Testing for invalid name: Invalid first name', ()=> {
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', '', 'File')).toStrictEqual({ error: 'error'});
  });

  // Invalid last name
  test('Testing for invalid name: Invalid last name', ()=> {
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'thislastnameisinvalidandshouldreturnerrorandbemorethan50char')).toStrictEqual({ error: 'error'});
  });

  test('Testing for invalid name: Invalid last name', ()=> {
    expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', '')).toStrictEqual({ error: 'error'});
  });

});
