// from @luise-rios

const connection = require('./connection');

const create = async (message, nickname, timestamp) => {
  await connection().then((db) =>
    db.collection('messages').insertOne({ message, nickname, timestamp }));
};

const getAll = () => connection().then((db) => db.collection('messages').find().toArray());

module.exports = {
  getAll,
  create,
};