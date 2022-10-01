import { channelMessagesV1, channelsListV1 } from './channel';
import { authRegisterV1, authLoginV1 } from './auth';
import { clearV1 } from './others';

// invalid inputs (integers)
test('invalid input', () => {
	clearV1();
	expect(channelMessagesV1('hi','hello','ya')).toStrictEqual({ 
		error: 'error'});
});

test('invalid input', () => {
	clearV1();
	expect(channelMessagesV1('cat',335,-1)).toStrictEqual({ 
		error: 'error'});
});

test('invalid input', () => {
	clearV1();
	expect(channelMessagesV1(1,'dog',-1)).toStrictEqual({ 
		error: 'error'});
});

// test for the correct input
test('valid input', () => {
	clearV1();
	expect(channelMessagesV1(1,289,122)).toStrictEqual({ 
		});
});


// start
test('checking total messages', () => {
	clearV1();
	const messages = [
		{
			messageId: 2,
			uId: 3,
			message: 5,
			timeSent: 3,
		},
		{
			messageId: 5,
			uId: 6,
			message: 2,
			timeSent: 1,
		},
		{
			messageId: 1,
			uId: 3,
			message: 2,
			timeSent: 3,
		},
	];
	
	let personId = authRegisterV1('tonyyeung0905@gmail.com', 'Tony1125', 'Tony', 'Yeung');
	let channelId = channelsCreateV1(personId, 'NTUfriend', true);
	let result = channelMessagesV1(personId, channelId, 4); 
	expect().toStrictEqual({ 
		error: 'error'});
});
