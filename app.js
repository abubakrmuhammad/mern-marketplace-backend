const express = require('express');
const productsRouter = require('./routes/productRoutes');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/products', productsRouter)

module.exports = app;