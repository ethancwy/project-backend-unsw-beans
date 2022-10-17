import { clearV1 } from './other';
import { authRegisterV2, authLoginV2 } from './auth';

describe('Testing clear function', () => {
  test('Test the auth has been cleared', () => {
    authRegisterV2('tony0905@gmail.com', 'Tony0905', 'Tony', 'Yeung');
    clearV1();
    expect(authLoginV2('tony0905@gmail.com', 'Tony0905')).toStrictEqual({ error: 'error' });
  });
});
