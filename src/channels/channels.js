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

<<<<<<< HEAD
=======
export {
  channelsCreateV1,
  channelsListV1,
  channelsListAllV1
};
>>>>>>> f8e35c8640e81e1cb82898dd621e7d2f940c0fa3
