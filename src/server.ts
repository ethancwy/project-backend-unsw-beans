import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import { authRegisterV2, authLoginV2, authLogoutV1 } from './auth';
import { channelsCreateV2, channelsListV2, channelsListAllV2 } from './channels';
import { clearV1 } from './other';
import { channelJoinV2, channelInviteV2, channelDetailsV2, channelLeaveV1 } from './channel';
import { userProfileV2 } from './users';

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

app.get('/user/profile/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const uId = parseInt(req.query.uId as string);
  return res.json(userProfileV2(token, uId));
});

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
