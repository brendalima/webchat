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

const { formatDate } = require('./service/format');
const { getAll } = require('./models/messages');
const { create } = require('./models/messages');

// function by @vanessaberbidi
const handleMessage = ({ nickname, chatMessage }) => {
  const formattedDate = formatDate();
  const formatMessage = `${formattedDate} - ${nickname}: ${chatMessage}`;
  io.emit('message', formatMessage);
  create(chatMessage, nickname, formattedDate);
};

io.on('connection', (socket) => {
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
  socket.on('disconnect', () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit('usersList', users);
  });
});

app.use(cors());
app.get('/', async (_req, res) => { 
  const allMessages = await getAll();
  const messages = allMessages
    .map((m) => `${m.timestamp} - ${m.nickname}: ${m.message}`);
  return res.status(200).render('index', { users, messages });
});

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));