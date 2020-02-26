import verifyJWT from './middleware/user';
import jwt from 'jsonwebtoken';
const routes = (app, repository) => {
  app.get('/', function (req, res) {
    res.send('Hello');
  })

  app.get('/users', verifyJWT, (req, res, next) => {
  })

  app.post('/login', (req, res, next) => {
    //TODO db
    if (req.body.user === 'thai' && req.body.pwd === '123') {
      //auth ok
      const id = 1;
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300
      });
      res.status(200).send({ auth: true, token: token });
    }

    res.status(500).send('Invalid login!');
  });

  app.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
  });
}

export default routes;
