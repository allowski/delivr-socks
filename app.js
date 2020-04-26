const {createServer} = require('http');
const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');

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
       socket.join(room);
       io.to(room).emit('entered');
    });
    socket.on('unsubscribe', room => {
        socket.join(room);
        io.to(room).emit('left');
    });
});

app.post('/emit/:room/:message', (req, res) => {
    console.log({
        room: req.params.room,
        event: req.params.message,
    })
   io.to(req.params.room).emit(req.params.message, req.body)
   res.send({
      test: true
   });
});

server.listen(3000);
