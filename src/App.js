const express = require('express');
const cors = require('cors')
require('./db/conn');
require('../src/jobs/practiceAgendaJob');
const auth = require('./routes/auth');
const products = require('./routes/products');
const carts = require('./routes/carts');
const checkPayment = require('./routes/checkPayment');
const port = process.env.PORT || 3002;
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        method: ['Get', 'Post']
    }
});

app.use(cors());
app.use(express.json());

app.use('/auth', auth);
app.use('/products', products);
app.use('/carts', carts)
app.use('/checkPayment', checkPayment);

app.get('/', (req, res) => {
    res.send('ok');
})

http.listen(port, () => {
    console.log(`connection is running on port ${port}`)
})

io.on('connection', (socket) => {

    console.log('new client connected: ', socket.id);
    socket.emit('connection', null);

    socket.on('send_msg', (data) => {
        console.log({ data });
        //broad cast is use for ending message to all users
        socket.broadcast.emit('recieve_Message', data );

        //send data to specfic user

        // socket.to(data.room).emit('recieve_Message', data);
    })

    socket.on('join_room', (data) => {
        console.log('room => ', { data });
        socket.join(data.room);
    })

});