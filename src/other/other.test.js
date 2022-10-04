import { clearV1 } from './other.js';
import { authRegisterV1, authLoginV1 } from '../auth/auth.js';
import { channelsCreateV1 } from '../channels/channels.js';
import { channelDetailsV1 } from '../channel/channel.js';

describe('Testing clear function', () => {
	test('Test the auth has been clear',() => {
		authRegisterV1('tony0905@gmail.com','Tony0905','Tony','Yeung');
		clearV1();
		expect (authLoginV1('tony0905@gmail.com','Tony0905')).toStrictEqual({error: 'error'});
	});
});
