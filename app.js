const express = require('express');
require('dotenv').config();
const authRouter = require('./routes/authRoutes');

var cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;
