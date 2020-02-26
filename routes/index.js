import verifyJWT from './middleware/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const routes = (app, repository) => {
  app.get('/', function (req, res) {
    res.send('Hello');
  })

  app.get('/users', verifyJWT, (req, res, next) => {
  })

  app.post('/login', async (req, res, next) => {
    const { username, pwd } = req.body;

    repository.getUserAuth({ username }, (err, user) => {
      try {
        if (!user) {
          return res.status(400).send({ message: 'The user does not exist' });
        }
        if (!bcrypt.compareSync(pwd, user.pwd)) {
          return res.status(400).send({ message: 'Invalid login!' });
        }
        const { _id, perfil } = user;

        const token = jwt.sign({ _id, perfil }, process.env.SECRET, {
          expiresIn: 300
        });
        res.status(200).send({ auth: true, token: token });
      } catch (error) {
        res.status(500).send(error);
      }
    });
  });

  app.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
  });
}

export default routes;
