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

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVW-_.{}$|XYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


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

app.post('/emit/:room/:message', async (req, res) => {
    console.log({
        room: req.params.room,
        event: req.params.message,
    });
   io.to(req.params.room).emit(req.params.message, req.body)
   res.send({
      test: true
   });
});

app.post('/shorten', async (req, res) => {
    while(true) {
        const shorten = new shortlink({
            fullurl: req.body.url,
            short: makeid(5)
        });
        try {
            await shorten.save();
            res.send({
                url: `https://dlrv.cc/${shorten.short}`
            })
            break;
        }catch (e) {
        }
    }
});

app.get('/:short', async (req, res) => {
    const a = await shortlink.findOne({short: req.params.short});
    if(a){
        res.redirect(a.fullurl);
    }else{
        res.status(404).send({error: 'Not found'});
    }
});

server.listen(3000);
