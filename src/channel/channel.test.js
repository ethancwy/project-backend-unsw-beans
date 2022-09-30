import {
  channelJoinV1,
  channelInviteV1,
  channelMessagesV1,
  channelDetailsV1,
} from './channel';

import { authRegisterV1 } from '../auth/auth.js'
// import clear from '../other/other.js'
// import validator from 'validator'

// channelDetails should test for multiple members

test('Testing channelJoinV1', () => {
  // clear();
  let authId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
  let channelId = channelsCreateV1(authId, 'Boost', true);
  expect(channelJoinV1(authId, channelId)).toStrictEqual({});
  // expect(channelJoinV1(5, 2)).toStrictEqual({});
  expect(channelDetailsV1(authId, channelId)).toStrictEqual({
    name: 'James',
    isPublic: true,
    ownerMembers: [
      {
        uId: 1,
        email: 'foo@bar.com',
        nameFirst: 'James',
        nameLast: 'Charles',
        handleStr: 'charlesjames',
      }
    ],
    allMembers: [
      {
        uId: 1,
        email: 'foo@bar.com',
        nameFirst: 'James',
        nameLast: 'Charles',
        handleStr: 'charlesjames',
      }
    ],
  })
});



