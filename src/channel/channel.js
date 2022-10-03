function channelJoinV1(authUserId, channelId) {
  return {};
}

function channelInviteV1(authUserId, channelId, uId) {
  return {};
}

function channelMessagesV1(authUserId, channelId, start) {

	let data = getData();
	
	// check user id valid
	let foundu = false;
	for (let i = 0; i < data.users.length; i++) {
		if(data.users[i].uId === uId) {
			foundu = true;
			break;
		}
	}
	if (!foundu) return {error: 'error'};
	
	// check valid channel
	let found = false;
	for (let i = 0; i < data.channels.length; i++) {
		if(data.channels[i].channelId === channelId) {
			found = true;
			break;
		}
	}
	if (!found) return {error: 'error'};
	
	// check which channel it is by checking the channel id
	let channelIndex = 0;
	for (let index = 0; data.channels.length > index ;index++) {
		if (channelId === data.channels[index].channelId) {
			channelIndex = index;
		}
	}
	
	// check is the user in the channel
	if (!(authUserId in data.channels[channelIndex].memberId)) {
		return {error: 'error'};
	}
	
	// start is less than total message
	if (start > data.channels[channelIndex].channelmessages.length) {
		return {error: 'error'};
	}
	// check how many message in the channels
	var numMessage = data.channels[channelIndex].channelmessages.length;
	var end = numMessage;
	var list = [];
	// compare end with start
	if (numMessage > start + 50) {
		end = start + 50;
	}
	// get message out from data by accessed from channelId (push)
	for (let counter = start; counter < end; counter++) { 
		list.push({data.channels[channelIndex].channelmessages[counter]
		});
	}

	// there are no messages to load after the return
	if (numMessage < start + 50) {
		end = -1;
	}
	
  return {
  	message: list,
  	start: start,
  	end: end,
	};
}


function channelDetailsV1(authUserId, channelId) {
  return {
    name: 'Hayden',
    ownerMembers: [
      {
        uId: 1,
        email: 'example@gmail.com',
        nameFirst: 'Hayden',
        nameLast: 'Jacobs',
        handleStr: 'haydenjacobs',
      }
    ],
    allMembers: [
      {
        uId: 1,
        email: 'example@gmail.com',
        nameFirst: 'Hayden',
        nameLast: 'Jacobs',
        handleStr: 'haydenjacobs',
      }
    ],
  };
}

export {
  channelJoinV1,
  channelInviteV1,
  channelMessagesV1,
  channelDetailsV1
};
