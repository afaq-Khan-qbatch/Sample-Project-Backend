const express = require('express');
const cors = require('cors')
require ('./db/conn');
const auth = require('./routes/auth');
const products = require('./routes/products');
const carts = require('./routes/carts');
const checkPayment = require('./routes/checkPayment');
const port = process.env.PORT || 3002;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', auth);
app.use('/products' , products);
app.use('/carts' , carts)
app.use('/checkPayment', checkPayment);

app.get('/', (req , res) =>{
    res.send('ok');
})

app.listen(port , ()=>{
    console.log(`connection is running on port ${port}`)
})