import { channelsListV1, channelsCreateV1 } from './channels';
import { authRegisterV1, authLoginV1 } from '../auth/auth.js';
import { clearV1 } from '../other/other.js';

describe('channelsCreateV1 tests:', () => {
	test('Testing for invalid name(smaller than 1)', () => {
		clearV1();
		
		const person = authRegisterV1('hao@mail.com', '12345', 'hao', 'yang');

		expect(channelsCreateV1(person, '', true)).toStrictEqual({error: 'error'});
	});

	test('Testing for invalid name(greater than 20)', () => {
		clearV1();
		
		const person = authRegisterV1('hao@mail.com', '12345', 'hao', 'yang');

		expect(channelsCreateV1(person, '1234567890qwertyuiopasdfghjkl', true)).toStrictEqual({error: 'error'});
	});

	test('Testing for invalid authUserId', () => {
		clearV1();
		const invalidId = 9999;
		expect(channelsCreateV1(invalidId, 'hao/channel', true)).toStrictEqual({error: 'error'});
	});

	test('Testing for successful creation', () => {
		clearV1();
			
		const person = authRegisterV1('hao@mail.com', '12345', 'hao', 'yang');

		expect(channelsCreateV1(person, 'hao/channel', true)).toStrictEqual(
			{
				channelId: expect.any(Number),
				//correct value testing needed?
			}
		);
	});
});