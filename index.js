import 'dotenv/config';
import index from './routes/index';
import server from './server/server';
import repository from './repository/repository';

server.start(index, repository, (err, app) => {
  console.log('ok');
  console.error(err);
});
