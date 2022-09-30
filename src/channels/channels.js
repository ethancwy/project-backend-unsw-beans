function channelsCreateV1(authUserId, name, IsPublic) {
  return {
    channelId: 1,
  }
}

function channelsListV1(authUserId) {
  return {
    channels: [
      {
        channelId: 1,
        name: "My Channel",
      }
    ],
  }
}

function channelsListAllV1(authUserId) {
  return {
    channels: [
      {
        channelId: 1,
        name: 'My Channel',
      }
    ],
  };
}

