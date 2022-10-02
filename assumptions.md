1. Any user can create multiple channels (>1 channels)
2. Global owner can join private channels without an invitation
3. Global owners are not a part of ownerMembers (a key in the returning object for
  channelDetailsV1) in every channel they are in, unless added as a ownerMember by the channelOwner
  or themselves
4. If the global owner is removed, the next user who registered after the global owner
  becomes the new global owner
