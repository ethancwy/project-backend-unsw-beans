import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import { authRegisterV2, authLoginV2, authLogoutV1 } from './auth';
import { channelsCreateV2 } from './channels';
import { clearV1 } from './other';

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

app.post('channels/create/v2', (req: Request, res: Response) => {
  const { token, name, isPublic } = req.body;
  return res.json(channelsCreateV2(token, name, isPublic));
});

app.post('/auth/logout/v1', (req: Request, res: Response) => {
  const { token } = req.body;
  return res.json(authLogoutV1(token));
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  res.json(clearV1());
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
