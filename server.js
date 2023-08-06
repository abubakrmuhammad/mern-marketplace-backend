const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE_URI.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('Connected to DB. 🚀');

    app.listen(port, () => {
      console.log(`App listening on port ${port}. 🤞`);
    });
  })
  .catch(err => {
    console.error('Error connecting to DB. 💥', err);
  });
