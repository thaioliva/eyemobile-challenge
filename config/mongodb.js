import { MongoClient as mongoClient } from 'mongodb';
let connection = null;
let db = null;

const connect = (callback) => {

  if (connection) return callback(null, db);

  mongoClient.connect(process.env.MONGO_CONNECTION, function (err, conn) {
    if (err) return callback(err, null);

    connection = conn;
    db = conn.db(process.env.DATABASE);
    return callback(null, db)
  })
}

const disconnect = () => {
  if (!connection) return true;
  connection.close();
  connection = null;
  return true;
}

export default { connect, disconnect }
