const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

app.set('view engine', 'ejs');
app.use(cors());

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  } });

const PORT = 3000;
let users = [];
let messages = [];

const { formatDate } = require('./service/format');

const handleMessage = ({ nickname, chatMessage }) => {
  const formattedDate = formatDate();
  const formatMessage = `${formattedDate} - ${nickname}: ${chatMessage}`;
  messages = [...messages, formatMessage];
  io.emit('message', formatMessage);
};

io.on('connection', (socket) => {
  console.log('Conectado');
  console.log(`novo usuário conectado! ${socket.id}`);
  socket.on('newUserEntry', (nickname) => {
    users = [...users, { socketId: socket.id, nickname }];
    console.log(users);
    io.emit('usersList', users);
  });
  socket.on('message', handleMessage);
  socket.on('updateNickname', (nickname) => {
    // lines from @CarolSi-hub
    const userPosition = users.indexOf(users.find((user) => user.socketId === socket.id));
    users[userPosition].nickname = nickname;
    io.emit('usersList', users);
});
});

app.use(cors());
app.get('/', async (_req, res) => { 
  res.render('index', { users, messages });
});

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));