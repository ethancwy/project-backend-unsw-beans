import { channelsListV1, channelsCreateV1 } from './channels';
import { authRegisterV1, authLoginV1 } from '../auth/auth.js';
import { clearV1 } from '../other/other.js';

describe('channelsCreateV1 tests:', () => {
	test('Testing for invalid name(smaller than 1)', () => {
		clearV1();
		
		const person = authRegisterV1('hao@mail.com', '12345', 'hao', 'yang');

		const personId = authLoginV1('hao@mail.com', '12345');

		expect(channelsCreateV1(personId, '', true)).toStrictEqual({error: 'error'});
	});

	test('Testing for invalid name(greater than 20)', () => {
		clearV1();
		
		const person = authRegisterV1('hao@mail.com', '12345', 'hao', 'yang');

		const personId = authLoginV1('hao@mail.com', '12345');

		expect(channelsCreateV1(personId, '1234567890qwertyuiopasdfghjkl', true)).toStrictEqual({error: 'error'});
	});

	test('Testing for invalid authUserId', () => {
		clearV1();
		const invalidId = 9999;
		expect(channelsCreateV1(invalidId, 'hao/channel', true)).toStrictEqual({error: 'error'});
	});

	test('Testing for successful creation', () => {
		clearV1();
			
		const person = authRegisterV1('hao@mail.com', '12345', 'hao', 'yang');

		const personId = authLoginV1('hao@mail.com', '12345');

		expect(channelsCreateV1(personId, 'hao/channel', true)).toStrictEqual(
			{
				channelId: expect.any(Number),
			}
		);
	});
});


describe('channelsListV1 tests:', () => {
	test('Testing for invalid authUserId', () => {
		clearV1();
		
		const invalidId = 9999;

		expect(channelsCreateV1(invalidId, '', true)).toStrictEqual({error: 'error'});
	});

	test('Testing for successful creation', () => {
		clearV1();
			
		const person = authRegisterV1('hao@mail.com', '12345', 'hao', 'yang');
		const person2 = authRegisterV1('ethan@mail.com', '56789', 'ethan', 'chew');

		const personId = authLoginV1('hao@mail.com', '12345');
		const personId2 = authLoginV1('ethan@mail.com', '56789');
		
		const channel1 = channelsCreateV1(personId, 'hao/channel1', true); 
		const channel2 = channelsCreateV1(personId, 'hao/channel2', true); 
		const channel3 = channelsCreateV1(personId, 'hao/channel3', false); 
		const channel4 = channelsCreateV1(personId2, 'ethan/channel1', true); 

		expect(channelsListV1(personId)).toStrictEqual(
			{
				channeld: [
					{
						channelId: channel1,
						name: 'hao/channel1',
					},
					{
						channelId: channel2,
						name: 'hao/channel2',
					},
					{
						channelId: channel3,
						name: 'hao/channel3',
					},
				]
			}
		);
	});
});