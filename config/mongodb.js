import { MongoClient as mongoClient } from 'mongodb';
let connection = null;
let db = null;

const connect = (callback) => {

  if (connection) return callback(null, db);

  mongoClient.connect(process.env.MONGO_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
    .then((conn) => {
      connection = conn;
      db = conn.db(process.env.DATABASE);
      callback(null, db)
    })
    .catch((err) => callback(err, null));



}
const disconnect = () => {
  if (!connection) return true;
  connection.close();
  connection = null;
  return true;
}

export default { connect, disconnect }
