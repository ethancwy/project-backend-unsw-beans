import channelJoinV1 from './channel';
import { channelsCreateV1, channelsListAllV1 } from '../channels/channels.js'
import authRegisterV1 from '../auth/auth.js'
import clearV1 from '../other/other.js'

describe ('Testing channelListAllV1 standard', () => {

	test('Test that the baseline function works', () => {
		clearV1();
		let globalOwnerId = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');
		let channelOwnerId = authRegisterV1('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
		let channelIdPublic = channelsCreateV1(channelOwnerId, 'Boost', true);

		expect(channelsListAllV1(channelOwnerId)).toEqual([
			{
				name: 'Boost',
				isPublic: true,
				ownerMembers: [
					{
						uId: channelOwnerId.uId,
						email: 'chocolate@bar.com',
						nameFirst: 'Willy',
						nameLast: 'Wonka',
						handleStr: expect.any(String), //
					},
				],
				allMembers: [
					{
						uId: channelOwnerId.uId,
						email: 'chocolate@bar.com',
						nameFirst: 'Willy',
						nameLast: 'Wonka',
						handleStr: expect.any(String),
					},
				],
			},
		]);
	});

	let memberId = authRegisterV1('chicken@bar.com', 'goodpassword', 'Ronald', 'Mcdonald');

  test('Test that the functions works when there is more than one member', () => {
		channelJoinV1(memberId, channelIdPublic);

		expect(channelOwnerId).toEqual([
			{
				name: 'Boost',
				isPublic: true,
				ownerMembers: [
					{
						uId: channelOwnerId.uId,
      	    email: 'chocolate@bar.com',
      	    nameFirst: 'Willy',
      	    nameLast: 'Wonka',
      	    handleStr: expect.any(String),
      	  }
      	],
				allMembers: [
					{
						uId: channelOwnerId.uId,
      	    email: 'chocolate@bar.com',
      	    nameFirst: 'Willy',
      	    nameLast: 'Wonka',
      	    handleStr: expect.any(String),
      	  },
      	  {
						uId: memberId.uId,
      	    email: 'chicken@bar.com',
      	    nameFirst: 'Ronald',
      	    nameLast: 'Mcdonald',
      	    handleStr: expect.any(String),
      	  }
      	],
    	},
		]);
	});

	test('test that function works with more than one channel including priv channel', () => {
		let channelIdPrivate = channelsCreateV1(channelOwnerId, 'priv_channel', false);

		test(channelsListAllV1(channelOwnerId)).toEqual([
			{
				name: 'Boost',
				isPublic: true,
				ownerMembers: [
					{
						uId: channelOwnerId.uId,
      	    email: 'chocolate@bar.com',
      	    nameFirst: 'Willy',
      	    nameLast: 'Wonka',
      	    handleStr: expect.any(String),
      	  }
      	],
				allMembers: [
					{
						uId: channelOwnerId.uId,
      	    email: 'chocolate@bar.com',
      	    nameFirst: 'Willy',
      	    nameLast: 'Wonka',
      	    handleStr: expect.any(String),
      	  },
      	  {
						uId: memberId.uId,
      	    email: 'chicken@bar.com',
      	    nameFirst: 'Ronald',
      	    nameLast: 'Mcdonald',
      	    handleStr: expect.any(String),
      	  }
      	],
    	},
			{
				name: 'priv_channel',
				isPublic: false,
				ownerMembers: [
					{
						uId: channelOwnerId.uId,
						email: 'chocolate@bar.com',
						nameFirst: 'Willy',
						nameLast: 'Wonka',
						handleStr: expect.any(String),
					},
				],
			allMembers: [
					{
        	  uId: channelOwnerId.uId,
        	  email: 'chocolate@bar.com',
        	  nameFirst: 'Willy',
        	  nameLast: 'Wonka',
        	  handleStr: expect.any(String),
        	},
        	{
        	  uId: memberId.uId,
        	  email: 'chicken@bar.com',
        	  nameFirst: 'Ronald',
        	  nameLast: 'Mcdonald',
        	  handleStr: expect.any(String),
        	},
				],
			},
		]);
	});
});

describe ('Testing the edge cases', () => {

	test('Test for when authuserId is invalid', () => {
		clearV1();
		let fake_user = -20;

		expect(channelsListAllV1(fake_user)).toEqual(fake_user + " is invalid");
	});

	test('Test for when there are no channels in existence yet', () => {
		clearV1();
		let user = authRegisterV1('foo@bar.com', 'password', 'James', 'Charles');

		expect(authUserId).toEqual([]);
	});
});
