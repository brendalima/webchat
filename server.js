const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
// const random = require('random-name')
app.set('view engine', 'ejs');
app.use(cors());

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  } });

const PORT = 3000;

const { formatDate } = require('./service/format');

const handleMessage = ({ nickname, chatMessage }) => {
  const formattedDate = formatDate();
  const formatMessage = `${formattedDate} - ${nickname}: ${chatMessage}`;
  io.emit('message', formatMessage);
};

io.on('connection', (socket) => {
  console.log('Conectado');
  socket.on('message', handleMessage);
});

app.use(cors());

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));