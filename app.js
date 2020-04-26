const {createServer} = require('http');
const app = require('express')();

const server = createServer(app);

const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.send({hello: 'world'})
});

io.on('connection', (socket) => {
    console.log('connected');
});

server.listen(3000);
