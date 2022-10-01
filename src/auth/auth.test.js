import { authLoginV1, authRegisterV1 } from'./auth';

beforeEach(()=> {
  clear();
});

describe('Testing for authRegisterV1: ', ()=> {
  // Valid register
	test('Testing for valid register', ()=> {
		expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 'File').toStrictlyEqual(
			{
				authUserId: expect.any(Number)
			}
		));
	});

  // Invalid email
	test('Testing for invalid register: Invalid email', ()=> {
		expect(authRegisterV1(123, 'Bob100', 'Peter', 'File').toStrictlyEqual({ error: expect.any(String)}));
	});

	test('Testing for invalid register: Invalid email', ()=> {
		expect(authRegisterV1('', 'Bob100', 'Peter', 'File').toStrictlyEqual({ error: expect.any(String)}));
	});


  // Invalid password
	test('Testing for invalid password: Invalid password', ()=> {
		expect(authRegisterV1('p.file@gmail.com', 123, 'Peter', 'File').toStrictlyEqual({ error: expect.any(String)}));
	});

	test('Testing for invalid password: Invalid password', ()=> {
		expect(authRegisterV1('p.file@gmail.com', '', 'Peter', 'File').toStrictlyEqual({ error: expect.any(String)}));
	});

  // Invalid first name
	test('Testing for invalid name: Invalid first name', ()=> {
		expect(authRegisterV1('p.file@gmail.com', 'Bob100', 123, 'File').toStrictlyEqual({ error: expect.any(String)}));
	});

	test('Testing for invalid name: Invalid first name', ()=> {
		expect(authRegisterV1('p.file@gmail.com', 'Bob100', '', 'File').toStrictlyEqual({ error: expect.any(String)}));
	});

  // Invalid last name
	test('Testing for invalid name: Invalid last name', ()=> {
		expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', 123).toStrictlyEqual({ error: expect.any(String)}));
	});

	test('Testing for invalid name: Invalid last name', ()=> {
		expect(authRegisterV1('p.file@gmail.com', 'Bob100', 'Peter', '').toStrictlyEqual({ error: expect.any(String)}));
	});

});



test('Testing for authLoginV1: ', ()=> {

  // Valid login
	test('Testing for Valid login: ', ()=> {
		expect(authLoginV1('p.file@gmail.com', 'Bob100').toStrictlyEqual(
			{
				authUserId: expect.any(Number)
			}
		));
	});


  // Invalid email
	test('Testing for invalid login email: Invalid email', ()=> {
  	expect(authLoginV1(123, 'Bob100').toStrictlyEqual({ error: expect.any(String)}));
	});

	test('Testing for invalid login email: Invalid email', ()=> {
	  expect(authLoginV1('', 'Bob100').toStrictlyEqual({ error: expect.any(String)}));
	});

	// Invalid password
	test('Testing for invalid login password: Invalid password', ()=> {
		expect(authLoginV1('p.file@gmail.com', 123).toStrictlyEqual({ error: expect.any(String)}));
	});

	test('Testing for invalid login password: Invalid password', ()=> {
		expect(authLoginV1('p.file@gmail.com', '').toStrictlyEqual({ error: expect.any(String)}));
	});

});