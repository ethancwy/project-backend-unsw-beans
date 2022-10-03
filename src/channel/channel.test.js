
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


// start
test('checking total messages', () => {
	clearV1();
	let data = getData();
	let personId = authRegisterV1('tonyyeung0905@gmail.com', 'Tony1125', 'Tony', 'Yeung');
	let newChannelId = channelsCreateV1(personId, 'NTUfriend', true);
	
	const createMessages = [
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
	
	// check is the right channel index to push it in
	let channelIndex = 0;
	for (let index = 0; data.channels.length > index; index++) {
		if (newChannelId === data.channels.channelId[index]) {
			channelIndex = index;
		}
	}
	
	//pushing message into dataStore
	for(let i = 0; createMessages.length > i; i++) {
		data.channels[channelIndex].channelmessages.push({messageId: createMessages[i].messageId,uId: createMessages[i].uId ,message: createMessages[i].message, timeSent: createMessages[i].timeSent})
	}
	
	let result = channelMessagesV1(personId, channelId, 4); 
	expect(result).toStrictEqual({ 
		error: 'error'});
});


test('checking total messages', () => {
	clearV1();
	let data = getData();
	let personId = authRegisterV1('tonyyeung0905@gmail.com', 'Tony1125', 'Tony', 'Yeung');
	let newChannelId = channelsCreateV1(personId, 'NTUfriend', true);
	
	const createMessages = [
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
	
	// check is the right channel index to push it in
	let channelIndex = 0;
	for (let index = 0; data.channels.length > index; index++) {
		if (newChannelId === data.channels.channelId[index]) {
			channelIndex = index;
		}
	}
	
	//pushing message into dataStore
	for(let i = 0; createMessages.length > i; i++) {
		data.channels[channelIndex].channelmessages.push({messageId: createMessages[i].messageId,uId: createMessages[i].uId ,message: createMessages[i].message, timeSent: createMessages[i].timeSent})
	}
	
	let result = channelMessagesV1(personId, channelId, 1); 
	expect(result).toStrictEqual({ 
		message:
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
			start:1,
			end:expect.any(Number),
		});
		
});




