const express = require('express');
const productsRouter = require('./routes/productRoutes');
const usersRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter)

module.exports = app;