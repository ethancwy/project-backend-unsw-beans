import { authRegister, authLogin, clear } from './global';

clear();

describe('Testing clear function', () => {
  test('Test the user has been cleared', () => {
    authRegister('tony0905@gmail.com', 'Tony0905', 'Tony', 'Yeung');
    clear();
    expect(authLogin('tony0905@gmail.com', 'Tony0905')).toStrictEqual({ error: 'error' });
  });
});
clear();
