const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');

const usersRouter = require('./routes/userRoutes');
const productsRouter = require('./routes/productRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const cartRouter = require('./routes/cartRoutes');

const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use('/api/*', cors());
app.options('/api/*', cors());
app.use(mongoSanitize());
app.use(compression());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cart', cartRouter);

app.use(globalErrorHandler);

module.exports = app;
