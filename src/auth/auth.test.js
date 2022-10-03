



















































describe('Testing for authLoginV1: ', ()=> {
  // Valid login
  test('Testing for Valid login: ', ()=> {
    const register = authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    expect(authLoginV1('p.file@gmail.com', 'Bob100')).toStrictEqual(
      {
        authUserId: expect.any(Number)
      });
  });


  // Invalid email
  test('Testing for invalid login email: Invalid email', ()=> {
    const register = authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    expect(authLoginV1(123, 'Bob100')).toStrictEqual({ error: 'error'});
  });

  test('Testing for invalid login email: Invalid email', ()=> {
    const register = authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    expect(authLoginV1('', 123)).toStrictEqual({ error: 'error'});
  });

  // Invalid password
  test('Testing for invalid login password: Invalid password', ()=> {
    const register = authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    expect(authLoginV1('p.file@gmail.com', 123)).toStrictEqual({ error: 'error'});
  });

  test('Testing for invalid login password: Invalid password', ()=> {
    const register = authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File');
    expect(authLoginV1('p.file@gmail.com', '')).toStrictEqual({ error: 'error'});
  });

});