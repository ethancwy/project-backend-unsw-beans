import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';

import { authRegisterV2, authLoginV2, authLogoutV1 } from './auth';
import { channelsCreateV2, channelsListV2, channelsListAllV2 } from './channels';
import { clearV1 } from './other';
import {
  channelJoinV2, channelInviteV2, channelDetailsV2,
  channelMessagesV2, channelLeaveV1, channelAddOwnerV1, channelRemoveOwnerV1
} from './channel';
import {
  userProfileV2, usersAllV1, userSetNameV1, userSetEmailV1,
  userSetHandleV1
} from './users';
import { dmCreateV1, dmDetailsV1, dmLeaveV1, dmListV1, dmRemoveV1, dmMessagesV1 } from './dm';
import { messageSendV1, messageEditV1, messageRemoveV1, messageSenddmV1 } from './message';



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


app.post('/auth/register/v2', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  return res.json(authRegisterV2(email, password, nameFirst, nameLast));
});

app.post('/auth/login/v2', (req: Request, res: Response) => {
  const { email, password } = req.body;
  return res.json(authLoginV2(email, password));
});

app.post('/channels/create/v2', (req: Request, res: Response) => {
  const { token, name, isPublic } = req.body;
  return res.json(channelsCreateV2(token, name, isPublic));
});

app.get('/channels/list/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  return res.json(channelsListV2(token));
});

app.get('/channels/listAll/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  return res.json(channelsListAllV2(token));
});

app.get('/channel/messages/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const channelId = parseInt(req.query.channelId as string);
  const start = parseInt(req.query.start as string);
  return res.json(channelMessagesV2(token, channelId, start));
});

app.post('/auth/logout/v1', (req: Request, res: Response) => {
  const { token } = req.body;
  return res.json(authLogoutV1(token));
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  return res.json(clearV1());
});

app.post('/channel/join/v2', (req: Request, res: Response) => {
  const { token, channelId } = req.body;
  return res.json(channelJoinV2(token, channelId));
});

app.post('/channel/invite/v2', (req: Request, res: Response) => {
  const { token, channelId, uId } = req.body;
  return res.json(channelInviteV2(token, channelId, uId));
});

app.get('/channel/details/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const channelId = parseInt(req.query.channelId as string);
  return res.json(channelDetailsV2(token, channelId));
});

app.post('/channel/leave/v1', (req: Request, res: Response) => {
  const { token, channelId } = req.body;
  return res.json(channelLeaveV1(token, channelId));
});

app.post('/channel/addowner/v1', (req: Request, res: Response) => {
  const { token, channelId, uId } = req.body;
  return res.json(channelAddOwnerV1(token, channelId, uId));
});

app.post('/channel/removeowner/v1', (req: Request, res: Response) => {
  const { token, channelId, uId } = req.body;
  return res.json(channelRemoveOwnerV1(token, channelId, uId));
});

app.get('/user/profile/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const uId = parseInt(req.query.uId as string);
  return res.json(userProfileV2(token, uId));
});

app.get('/users/all/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  return res.json(usersAllV1(token));
});

app.put('/user/profile/setname/v1', (req: Request, res: Response) => {
  const { token, nameFirst, nameLast } = req.body;
  return res.json(userSetNameV1(token, nameFirst, nameLast));
});

app.put('/user/profile/setemail/v1', (req: Request, res: Response) => {
  const { token, email } = req.body;
  return res.json(userSetEmailV1(token, email));
});

app.put('/user/profile/sethandle/v1', (req: Request, res: Response) => {
  const { token, handleStr } = req.body;
  return res.json(userSetHandleV1(token, handleStr));
});

app.post('/dm/create/v1', (req: Request, res: Response) => {
  const token = req.body.token;
  const uids = req.body.uIds;

  return res.json(dmCreateV1(token, uids));
});

app.get('/dm/list/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  return res.json(dmListV1(token));
});

app.delete('/dm/remove/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const dmId = parseInt(req.query.dmId as string);
  return res.json(dmRemoveV1(token, dmId));
});

app.get('/dm/details/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const dmId = parseInt(req.query.dmId as string);
  return res.json(dmDetailsV1(token, dmId));
});

app.post('/dm/leave/v1', (req: Request, res: Response) => {
  const { token, dmId } = req.body;
  return res.json(dmLeaveV1(token, dmId));
});

app.get('/dm/messages/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const dmId = parseInt(req.query.dmId as string);
  const start = parseInt(req.query.start as string);
  return res.json(dmMessagesV1(token, dmId, start));
});

app.post('/message/send/v1', (req: Request, res: Response) => {
  const { token, channelId, message } = req.body;
  return res.json(messageSendV1(token, channelId, message));
});

app.put('/message/edit/v1', (req: Request, res: Response) => {
  const { token, messageId, message } = req.body;
  return res.json(messageEditV1(token, messageId, message));
});

app.delete('/message/remove/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const messageId = parseInt(req.query.messageId as string);
  return res.json(messageRemoveV1(token, messageId));
});

app.post('/message/senddm/v1', (req: Request, res: Response) => {
  const { token, dmId, message } = req.body;
  return res.json(messageSenddmV1(token, dmId, message));
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
