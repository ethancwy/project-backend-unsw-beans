import { authRegister, dmCreate, clear, dmList, dmRmove, dmDetails, dmLeave } from './global';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

// Tests for dm/create/v1
describe ('Testing dm/create/v1 standard', () => {

  test('Testing function success', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');

    expect(dmCreate(sender.token, [recipient.uId])).toStrictEqual({ dmId: expect.any(Number) });
  });

});

describe('Testing errors for dm/create/v1', () => {

  test('uId in uIds array does not refer to valid user', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');
    let fakeuser = recipient.uId;
    if (fakeuser === sender.uId) {
      fakeuser++;
    }
    
    expect(dmCreate(sender.token, [recipient.uId, fakeuser])).toStrictEqual({ error: expect.any(String) });
  });

  test('Duplicate uId in uIds array', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill');  

    expect(dmCreate(sender.token, [recipient.uId, recipient.uId])).toStrictEqual({ error: expect.any(String) })
  });

  test('Invalid token', () => {
    clear();
    fakeToken = 'jsdhfsjhdfkshjdfadfhwefvhjwef';
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill'); 
    
    expect(dmCreate(fakeToken, [recipient.uId])).toStrictEqual({ error: expect.any(String) });
  });
  
});

// Tests for dm/list/v1
describe('Testing dm/list/v1 standard', () => {
  
  test('Testing that function works', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill'); 
    const recipient2 = authRegister('heisenberg@hhm.com', 'bluecrystal', 'Walter', 'White');
    const dm = dmCreate(sender.token, [recipient.uId, recipient2.uId]);
    
    expect(dmList(sender.token)).toStrictEqual([{ dmId: dm.dmId, name: expect.any(String) }]);
  });  

});

describe('Testing dm/list/v1 errors', () => {

  test('Invalid token', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill'); 
    const dm = dmCreate(sender.token, [recipient.uId]);  
    fakeToken = 'sdfjskdfuhwefbvsdfguwyfsgjndfs';

    expect(dmList(fakeToken)).toStrictEqual({ error: expect.any(String) });
  });

});

// Tests for dm/remove/v1
describe('Testing dm/remove/v1 standard', () => {
  
  test('Testing that function works', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill'); 
    const recipient2 = authRegister('heisenberg@hhm.com', 'bluecrystal', 'Walter', 'White');
    const dm = dmCreate(sender.token, [recipient.uId, recipient2.uId]);
    
    expect(dmRmove(sender.token, dm.dmId)).toStrictEqual({});
  });  

});

describe('Testing dm/remove/v1 errors', () => {

  test('Invalid dmId', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill'); 
    const dm = dmCreate(sender.token, [recipient.uId]);  

    expect(dmRmove(sender.token, dm.dmId + 1)).toStrictEqual({ error: expect.any(String) });
  });

  test('Recipient removing dm', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill'); 
    const dm = dmCreate(sender.token, [recipient.uId]);  

    expect(dmRmove(recipient.token, dm.dmId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Sender removes dm but isnt legible', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill'); 
    const recipient2 = authRegister('heisenberg@hhm.com', 'bluecrystal', 'Walter', 'White');
    const dm = dmCreate(sender.token, [recipient.uId, recipient2.uId]);
    dmLeave( sender.token, dm.dmId );

    expect(dmRmove(sender.token, dm.dmId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid token', () => {
    clear();
    const sender = authRegister('pollos@hhm.com', 'password', 'Gus', 'Fring');
    const recipient = authRegister('goodman@hhm.com', 'secondpassword', 'Jimmy', 'McGill'); 
    const dm = dmCreate(sender.token, [recipient.uId]);  
    fakeToken = 'sdfjskdfuhwefbvsdfguwyfsgjndfs';

    expect(dmRmove(fakeToken, dm.dmId)).toStrictEqual({ error: expect.any(String) });
  });

});


// Probably useless now but keeping incase

    /*deleteRequest(SERVER_URL + '/clear/v1', {});
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
    })).toStrictEqual({ dmId: expect.any(Number) });*/

        /*const senderId = postRequest(SERVER_URL + '/auth/register/v2', {
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
    })).toStrictEqual({ error: expect.any(String) });*/

        /*const senderId = postRequest(SERVER_URL + '/auth/register/v2', {
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
    })).toStrictEqual({ error: expect.any(String) });*/

        /*const senderId = postRequest(SERVER_URL + '/auth/register/v2', {
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
    })).toStrictEqual({ error: expect.any(String) });*/