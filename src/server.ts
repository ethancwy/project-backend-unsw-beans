import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';

import { authRegisterV3, authLoginV3, authLogoutV2 } from './auth';
import { channelsCreateV3, channelsListV3, channelsListAllV3 } from './channels';
import { clearV1 } from './other';
import {
  channelJoinV3, channelInviteV3, channelDetailsV3,
  channelMessagesV3, channelLeaveV2, channelAddOwnerV2, channelRemoveOwnerV2
} from './channel';
import {
  userProfileV3, usersAllV2, userSetNameV2, userSetEmailV2,
  userSetHandleV2
} from './users';
import { dmCreateV2, dmDetailsV2, dmLeaveV2, dmListV2, dmRemoveV2, dmMessagesV2 } from './dm';
import {
  messageSendV2, messageEditV2, messageRemoveV2, messageSenddmV2, messageShareV1,
  messageReactV1, messageUnreactV1
} from './message';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Example get request
app.get('/echo', (req: Request, res: Response, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/register/v3', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  return res.json(authRegisterV3(email, password, nameFirst, nameLast));
});

app.post('/auth/login/v3', (req: Request, res: Response) => {
  const { email, password } = req.body;
  return res.json(authLoginV3(email, password));
});

app.post('/channels/create/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const { name, isPublic } = req.body;
  return res.json(channelsCreateV3(token, name, isPublic));
});

app.get('/channels/list/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  return res.json(channelsListV3(token));
});

app.get('/channels/listall/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  return res.json(channelsListAllV3(token));
});

app.get('/channel/messages/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const channelId = parseInt(req.query.channelId as string);
  const start = parseInt(req.query.start as string);
  return res.json(channelMessagesV3(token, channelId, start));
});

app.post('/auth/logout/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  return res.json(authLogoutV2(token));
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  return res.json(clearV1());
});

app.post('/channel/join/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId } = req.body;
  return res.json(channelJoinV3(token, channelId));
});

app.post('/channel/invite/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  return res.json(channelInviteV3(token, channelId, uId));
});

app.get('/channel/details/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const channelId = parseInt(req.query.channelId as string);
  return res.json(channelDetailsV3(token, channelId));
});

app.post('/channel/leave/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId } = req.body;
  return res.json(channelLeaveV2(token, channelId));
});

app.post('/channel/addowner/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  return res.json(channelAddOwnerV2(token, channelId, uId));
});

app.post('/channel/removeowner/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, uId } = req.body;
  return res.json(channelRemoveOwnerV2(token, channelId, uId));
});

app.get('/user/profile/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  const uId = parseInt(req.query.uId as string);
  return res.json(userProfileV3(token, uId));
});

app.get('/users/all/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  return res.json(usersAllV2(token));
});

app.put('/user/profile/setname/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { nameFirst, nameLast } = req.body;
  return res.json(userSetNameV2(token, nameFirst, nameLast));
});

app.put('/user/profile/setemail/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { email } = req.body;
  return res.json(userSetEmailV2(token, email));
});

app.put('/user/profile/sethandle/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { handleStr } = req.body;
  return res.json(userSetHandleV2(token, handleStr));
});

app.post('/dm/create/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const uIds = req.body.uIds as number[];
  return res.json(dmCreateV2(token, uIds));
});

app.get('/dm/list/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  return res.json(dmListV2(token));
});

app.delete('/dm/remove/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string);
  return res.json(dmRemoveV2(token, dmId));
});

app.get('/dm/details/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string);
  return res.json(dmDetailsV2(token, dmId));
});

app.post('/dm/leave/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { dmId } = req.body;
  return res.json(dmLeaveV2(token, dmId));
});

app.get('/dm/messages/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string);
  const start = parseInt(req.query.start as string);
  return res.json(dmMessagesV2(token, dmId, start));
});

app.post('/message/send/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { channelId, message } = req.body;
  return res.json(messageSendV2(token, channelId, message));
});

app.put('/message/edit/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { messageId, message } = req.body;
  return res.json(messageEditV2(token, messageId, message));
});

app.delete('/message/remove/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const messageId = parseInt(req.query.messageId as string);
  return res.json(messageRemoveV2(token, messageId));
});

app.post('/message/senddm/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const { dmId, message } = req.body;
  return res.json(messageSenddmV2(token, dmId, message));
});

app.post('/message/share/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const { ogMessageId, message, channelId, dmId } = req.body;
  return res.json(messageShareV1(token, ogMessageId, message, channelId, dmId));
});

app.post('/message/react/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const { messageId, reactId } = req.body;
  return res.json(messageReactV1(token, messageId, reactId));
});

app.post('/message/unreact/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const { messageId, reactId } = req.body;
  return res.json(messageUnreactV1(token, messageId, reactId));
});

// handles errors nicely
app.use(errorHandler());

// for logging errors (print to terminal)
app.use(morgan('dev'));

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
