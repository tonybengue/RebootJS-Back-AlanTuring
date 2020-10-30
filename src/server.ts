import express, { Request, Response, ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';

import { configuration, IConfig } from './config';
import { connect } from './database';
import mongoose from 'mongoose';
import connect_mongo from 'connect-mongo';
import generalRouter from './routes/router';
import cors from 'cors';
import { authenticationInitialize, authenticationSession } from './controllers/authenticationController';
import { initializeSocket } from './socket';

const MongoStore = connect_mongo(session);
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

export function createExpressApp(config: IConfig): express.Express {
  const { express_debug, session_cookie_name, session_secret } = config;

  const app = express(); // NodeJS Server

  // Middlewares
  app.use(morgan('combined'));  
  app.use(helmet());
  // Cors 
  app.use(cors({
    origin: true, //depuis n'importe où
    credentials: true
  }));
  app.use(express.json()); // Parses incoming requests with JSON payloads

  //Express session
  const sessionConfig = {
  // app.use(session({
    name: session_cookie_name,
    secret: session_secret,
    // store: new MongoStore({mongooseConnection: mongoose.connection}), // Recup connexion from mongoose,
    store: sessionStore, // recup co from mongoose
    saveUninitialized: false,
    resave: false, // not save the session each time
    cookie: {}
    // }));
  }

  // Secure cookies
  if(process.env.NODE_ENV === 'production'){
    app.set('trust proxy', 1);
    sessionConfig.cookie = {
      secure: true,
      sameSite: 'none'
    }
  }

  app.use(session(sessionConfig));
  app.use(authenticationInitialize());
  app.use(authenticationSession());

// Gestion erreurs express
  app.use(((err, _req, res, _next) => {
    console.error(err.stack);
    res.status?.(500).send(!express_debug ? 'Oups' : err);
  }) as ErrorRequestHandler);

  // Index page
  app.get('/', (req: Request, res: Response) => { 
    res.send('This is the boilerplate for Flint Messenger app');
  });

  // Endpoint
  app.use('/api', generalRouter);

  return app;
}

const config = configuration();
const { PORT } = config;
const app = createExpressApp(config);

connect(config).then( 
  // () => app.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`))
  () => {
    const server = app.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`))

    initializeSocket(config, server, sessionStore);
  },
);