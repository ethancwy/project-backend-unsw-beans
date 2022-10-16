import { postRequest, getRequest, deleteRequest } from './global';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

describe ('Testing dm/create/v1 standard', () => {

  test('Testing function success', () => {
    deleteRequest(SERVER_URL + '/clear/v1', {});
    const senderId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'pollos@hhm.com',
      password: 'password',
      nameFirst: 'Gus',
      nameLast: 'Fring',
    });
    const recipientId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'goodman@hhm.com',
      password: 'secondpassword',
      nameFirst: 'Jimmy',
      nameLast: 'McGill',
    });
    const recipient2Id = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'goodman@hhm.com',
      password: 'secondpassword',
      nameFirst: 'Jimmy',
      nameLast: 'McGill',
    });

    expect(postRequest(SERVER_URL + '/dm/create/V1', {
      token: senderId.token,
      uids: [recipientId.uId, recipient2Id.uId],
    })).toStrictEqual({ dmId: expect.any(Number) });
  });

});

describe('Testing errors for dm/create/v1', () => {

  test('uId in uIds array does not refer to valid user', () => {
    const senderId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'pollos@hhm.com',
      password: 'password',
      nameFirst: 'Gus',
      nameLast: 'Fring',
    });
    const recipientId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'goodman@hhm.com',
      password: 'secondpassword',
      nameFirst: 'Jimmy',
      nameLast: 'McGill',
    });
    let fakeuser = recipientId.uId + 1;
    if (fakeuser === senderId.uId) {
      fakeuser++;
    }

    expect(postRequest(SERVER_URL + '/dm/create/V1', {
      token: senderId.token,
      uids: [recipientId.uId, fakeuser],
    })).toStrictEqual({ error: expect.any(String) });
  });

  test('Duplicate uId in uIds array', () => {
    const senderId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'pollos@hhm.com',
      password: 'password',
      nameFirst: 'Gus',
      nameLast: 'Fring',
    });
    const recipientId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'goodman@hhm.com',
      password: 'secondpassword',
      nameFirst: 'Jimmy',
      nameLast: 'McGill',
    });

    expect(postRequest(SERVER_URL + '/dm/create/V1', {
      token: senderId.token,
      uids: [recipientId.uId, recipientId.uId],
    })).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid token', () => {
    const senderId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'pollos@hhm.com',
      password: 'password',
      nameFirst: 'Gus',
      nameLast: 'Fring',
    });
    const recipientId = postRequest(SERVER_URL + '/auth/register/v2', {
      email: 'goodman@hhm.com',
      password: 'secondpassword',
      nameFirst: 'Jimmy',
      nameLast: 'McGill',
    });
    let faketoken = senderId.token + 'completely random string';

    expect(postRequest(SERVER_URL + '/dm/create/V1', {
      token: faketoken,
      uids: [recipientId.uId],
    })).toStrictEqual({ error: expect.any(String) });
  });

});