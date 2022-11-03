import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';

function adminUserRemoveV1(token: string, uId: number) {
  return {};
}

function adminUserpermissionChangeV1(token: string, uId: number, permissionId: number) {
  return {};
}

export {
  adminUserRemoveV1,
  adminUserpermissionChangeV1
};