import { clearV1 } from './other.js';
import { authRegisterV1, authLoginV1 } from './auth.js';

describe('Testing clear function', () => {
  test('Test the auth has been cleared', () => {
    authRegisterV1('tony0905@gmail.com', 'Tony0905', 'Tony', 'Yeung');
    clearV1();
    expect(authLoginV1('tony0905@gmail.com', 'Tony0905')).toStrictEqual({ error: 'error' });
  });
});
