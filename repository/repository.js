import mongodb from '../config/mongodb';

const getUserAuth = async (user, callback) => {
  mongodb.connect((err, db) => {
    db.collection('users').findOne(user, callback);
  })
}

const insertTransaction = async (transaction, callback) => {
  mongodb.connect((err, db) => {
    // db.collection('transactions').createIndex(nsu, { unique: true });
    db.collection('transactions').insertOne(transaction, callback);
  })
}

const getAllTransactions = async (callback) => {
  mongodb.connect((err, db) => {
    db.collection('transactions').find().toArray(callback);
  })
}

const getTransactionBynsu = async (nsu, callback) => {
  mongodb.connect((err, db) => {
    db.collection('transactions').findOne({ 'nsu': nsu }, callback);
  })
}

const disconnect = () => {
  return mongodb.disconnect()
}

export default {
  getUserAuth, disconnect, insertTransaction, getAllTransactions, getTransactionBynsu
}
