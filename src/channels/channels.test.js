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
		
		const person = authRegisterV1('hao@mail.com', '1234512345', 'hao', 'yang');

		expect(channelsCreateV1(person, '1234567890qwertyuiopasdfghjkl', true)).toStrictEqual({error: 'error'});
	});

	test('Testing for invalid authUserId', () => {
		clearV1();
		
		const person = authRegisterV1('hao@mail.com', '1234512345', 'hao', 'yang');
		clearV1();

		expect(channelsCreateV1(person, 'hao/channel', true)).toStrictEqual({error: 'error'});
	});

	test('Testing for successful creation', () => {
		clearV1();
			
		const person = authRegisterV1('hao@mail.com', '1234512345', 'hao', 'yang');

		expect(channelsCreateV1(person, 'hao/channel', true)).toStrictEqual(
			{
				channelId: expect.any(Number),
				//correct value testing needed?
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
			
		const person = authRegisterV1('hao@mail.com', '1234512345', 'hao', 'yang');
		const person2 = authRegisterV1('ethan@mail.com', '5678956789', 'ethan', 'chew');
		
    const channel1 = channelsCreateV1(person, 'hao/channel1', true); 
    const channel2 = channelsCreateV1(person, 'hao/channel2', true); 
    const channel3 = channelsCreateV1(person, 'hao/channel3', false); 
		const channel4 = channelsCreateV1(person2, 'ethan/channel1', true);  

		expect(channelsListV1(person)).toStrictEqual(
			{
				channels: [
					{
						channelId: channel1.channelId,
						name: 'hao/channel1',
					},
					{
						channelId: channel2.channelId,
						name: 'hao/channel2',
					},
					{
						channelId: channel3.channelId,
						name: 'hao/channel3',
					},
				]
			}
		);
	});
});