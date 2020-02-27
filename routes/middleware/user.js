import 'dotenv/config';
import jwt from 'jsonwebtoken';
const verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    req.userId = decoded.id;
    req.perfil = decoded.perfil;

  });

  return true;
};

const auth = (req, res, next) => {
  if (verifyJWT(req, res, next) && perfil(req, res, next)) return next();
  else return res.status(403).send({ auth: true, message: 'Not authorized' });
}

const perfil = (req, res, next) => {
  const { perfil, originalUrl, method } = req;

  if (method === 'POST' && perfil === 'terminal' && originalUrl === '/transactions') return true;
  else if (method === 'GET' && perfil === 'portal' && (originalUrl === '/balance' || originalUrl === '/transactions')) return true;
  else return false;
}

export default auth;


