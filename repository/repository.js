import mongodb from '../config/mongodb';


const getUserAuth = async (user, callback) => {
  mongodb.connect((err, db) => {
    db.collection('users').findOne(user, callback);
  })
}

const disconnect = () => {
  return mongodb.disconnect()
}


export default {
  getUserAuth, disconnect
}
