const mongoose = require('mongoose');

const app = require('./app');
const config = require('./config');
const logger = require('./logger');

const start = async () => {
  const { DB_HOST, DB_PORT, DB_NAME } = config;
  if (!DB_HOST || !DB_PORT || !DB_NAME) {
    throw new Error('Mongo DB config is not complete');
  }

  try {
    const mongoUri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('Connection to MongoDB has been established successfully.');
  } catch (err) {
    logger.error('Unable to connect to DB: ', err);
  }

  app.listen(config.PORT, () => {
    logger.info(`Clients Dashboard App listening on port ${config.PORT}`);
  });
};

start();
