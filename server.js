const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

const PORT = process.env.PORT || 8000;
const messages = [];
let users = [];

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  console.log(path.join(__dirname, 'client', 'index.html'));

  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.use((req, res) => {
  res.send('You typed wrong address');
});

const server = app.listen(PORT, () => {
  console.log('Server is running');
});

const io = socket(server);

io.on('connection', socket => {
  let userName = '';

  socket.on('message', message => {
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('newMember', ({ user }) => {
    users.push({ name: user, id: socket.id });
    userName = user;
    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: `${userName} has joined a room`,
    });
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');

    users = users.filter(user => user.id !== socket.id);

    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: `${userName} has left the conversation... :(`,
    });
  });
});
