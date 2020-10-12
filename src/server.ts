import express, { Request, Response, ErrorRequestHandler } from 'express'; // NodeJs Server
import morgan from "morgan"; // HTTP request logger middleware
import helmet from "helmet"; // Configuration HTTP to security
import { configuration, IConfig } from "./config"; // Configuration

// connexion to mongoDb but wrapped/replaced by ourselves
import { connect } from './database'; 

// import of the router
import generalRouter from './routes/router';

export function createExpressApp(config: IConfig): express.Express {
  const { express_debug } = config;

  const app = express(); // NodeJS Server

  // Middlewares
  app.use(morgan('combined'));  
  app.use(helmet()); 
  app.use(express.json()); // Parses incoming requests with JSON payloads

// Gestion erreurs express
  app.use(((err, _req, res, _next) => {
    console.error(err.stack);
    res.status?.(500).send(!express_debug ? 'Oups' : err);
  }) as ErrorRequestHandler);

  // Index page
  app.get('/', (req: Request, res: Response) => { res.send('This is the boilerplate for Flint Messenger app') });

  // Endpoint
  app.use('/api', generalRouter);

  return app;
}

const config = configuration();
const { PORT } = config;
const app = createExpressApp(config);

connect(config).then( 
  () => app.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`))
)
