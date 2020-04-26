const {createServer} = require('http');
const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const credentials = require('./credentials');
const conn = mongoose.createConnection(credentials.uri);

const shortlink = conn.model('shortlink', require('./models/shortlink'));
const message = conn.model('message', require('./models/message'));

const server = createServer(app);

const io = require('socket.io')(server);

app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send({hello: 'world'})
});

io.on('connection', (socket) => {
    console.log('connected');
    socket.on('subscribe', room => {
       console.log('subscribe', room);
       socket.join(room);
       io.to(room).emit('entered');
    });
    socket.on('unsubscribe', room => {
        console.log('unsubscribe', room);
        socket.join(room);
        io.to(room).emit('left');
    });
});

app.post('/emit/:room/:message', (req, res) => {
    console.log({
        room: req.params.room,
        event: req.params.message,
    });
   io.to(req.params.room).emit(req.params.message, req.body)
   res.send({
      test: true
   });
});

app.get('/:short');

server.listen(3000);
