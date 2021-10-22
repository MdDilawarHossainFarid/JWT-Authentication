const mongoose = require('mongoose');
const { db } = require('../config');

const dbURI = `mongodb://${db.host}:${db.port}/${db.name}`;

mongoose
  .connect(dbURI)
  .then(() => {
    console.log('mongodb connected');
  })
  .catch((error) => console.log(error.message));

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db');
});

mongoose.connection.on('error', (error) => {
  console.log(error.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('mongoose connection is disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
