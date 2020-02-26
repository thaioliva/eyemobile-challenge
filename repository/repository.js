import mongodb from '../config/mongodb';


const disconnect = () => {
  return mongodb.disconnect()
}

module.exports = {
  disconnect,
};
