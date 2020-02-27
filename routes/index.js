import auth from './middleware/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import transactionUtils from '../src/transaction';
const routes = (app, repository) => {
  app.get('/', function (req, res) {
    res.send('Hello');
  })

  app.get('/transactions', auth, (req, res, next) => {
    try {
      repository.getAllTransactions((err, transactions) => {
        if (err) throw err;
        res.status(200).send({ data: transactions, length: transactions.length });
      });

    } catch (error) {
      res.status(500).send(error);
    }
  })


  app.get('/balance', auth, (req, res, next) => {
    try {
      repository.getAllTransactions((err, transactions) => {
        if (err) throw err;
        const balance = transactionUtils.getBalance(transactions);
        res.status(200).send(balance);
      });

    } catch (error) {
      res.status(500).send(error);
    }
  })

  app.post('/transactions', auth, async (req, res, next) => {
    try {
      const transaction = req.body;

      const { isValid, messages } = transactionUtils.isValid(transaction, repository);
      if (isValid) {
        const objTransaction = transactionUtils.normalizeTransaction(transaction);
        repository.insertTransaction(objTransaction, (err, result) => {
          if (err) throw err;
          if (result && result.insertedCount)
            res.status(200).send({ message: 'ok' });
        });
      } else {
        res.status(400).send({ messages });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    repository.getUserAuth({ username }, (err, user) => {
      try {
        if (!user) {
          return res.status(400).send({ message: 'The user does not exist' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(400).send({ message: 'Invalid login!' });
        }
        const { _id, perfil } = user;

        const token = jwt.sign({ _id, perfil }, process.env.SECRET, {
          expiresIn: 30000
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
