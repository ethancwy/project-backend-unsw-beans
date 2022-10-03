import { clearV1 } from './other';
import { authRegister, authLogin } from './auth';
import { channelsCreateV1 } from './channels';
import { channelDetailsV1 } from './channel';

describe('Sample test', () => {
	test('Test the auth has been clear',() => {
		authRegister('tony0905@gmail.com','Tony0905', 'Tony', 'Yeung');
  	clearV1();
  	expect(authLogin('tony0905@gmail.com','Tony0905')).toStrictEqual(
  		{error: 'error'});  
	});
	
	
	test('Test the channel has been clear', () => {
	  const ninaId = authRegister('nina0803@gmail.com','Nina0803', 'Nina', 'Yeh');
		const dogChannelId = channelsCreateV1('ninaId', 'dogFriend', true);
		clearV1();
		expect(channelDetailsV1('ninaId', 'dogChannelId')).toStrictEqual {
			{error: 'error'});
		}
	});
});
