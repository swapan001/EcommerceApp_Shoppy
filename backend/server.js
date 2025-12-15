// server.js
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const app = express();
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const categoryRoute = require('./routes/categoryRoutes')
const productRoute = require('./routes/productRoutes')
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

dotenv.config();

connectDB();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);

app.get('/', (req, res) => {
    res.send("<h1>Welcome to Ecommerce App</h1>");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server Running on port ${port}`.bgCyan.white);
});
