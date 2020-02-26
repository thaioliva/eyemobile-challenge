import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';

let server = null;
const port = process.env.PORT || 3000;

const start = ((api, repository, callback) => {
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(morgan('tiny'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use((err, req, res, next) => {
    callback(new Error(`Something wrong ${err}`), null);
    res.status(500).send('ooops');
  });

  api(app, repository);
  server = app.listen(parseInt(port), () => {
    callback(null, server);
    console.log(`CORS-enabled web server listening on port ${process.env.PORT}`);
  });
});

const stop = (() => {
  if (server) server.close();
  return true;
});

module.exports = {
  start,
  stop,
}
