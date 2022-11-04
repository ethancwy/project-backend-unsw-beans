import {
  authRegister, channelsCreate,
  clear,
  adminUserRemove,
  // adminUserpermissionChange
} from './global';

// test failed cases for adminuserremove
describe('/admin/user/remove/v1 failed cases', () => {
  test('uId invalid does not exist/already removed', () => {
    clear();
    const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const user1 = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    expect(adminUserRemove(globalOwnerId.token, -10)).toStrictEqual(400);
    expect(adminUserRemove(globalOwnerId.token, user1.authUserId)).toStrictEqual({});
    expect(adminUserRemove(globalOwnerId.token, user1.authUserId)).toStrictEqual(400);
  });

  test('uId is only global owner', () => {
    clear();
    const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    expect(adminUserRemove(globalOwnerId.token, globalOwnerId.authUserId)).toStrictEqual(400);
  });

  test('auth user is not global owner', () => {
    clear();
    const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const user1 = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    expect(adminUserRemove(user1.token, globalOwnerId.authUserId)).toStrictEqual(403);
    expect(adminUserRemove(user1.token, user1.authUserId)).toStrictEqual(403);
  });
});

// test success cases for adminuserremove
describe('/admin/user/remove/v1 non failed cases', () => {
  test('global owner removing normal user', () => {
    clear();
    const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
    const user1 = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
    expect(adminUserRemove(globalOwnerId.token, user1.authUserId)).toStrictEqual({});
    expect(channelsCreate(user1.token, 'cannot exist channel', true)).toStrictEqual(403);
  });

  // test('global owner removing another global owner', () => {
  //   clear();
  //   const globalOwnerId = authRegister('foo@bar.com', 'password', 'James', 'Charles');
  //   const user1 = authRegister('chocolate@bar.com', 'g00dpassword', 'Willy', 'Wonka');
  //   expect(adminUserpermissionChange(globalOwnerId.token, user1.authUserId, 1)).toStrictEqual({});
  //   expect(adminUserRemove(globalOwnerId.token, user1.authUserId)).toStrictEqual({});
  //   expect(channelsCreate(user1.token, 'cannot exist channel', true)).toStrictEqual(403);
  // });
});
