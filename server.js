const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 8000;
const messages = [];

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  console.log(path.join(__dirname, 'client', 'index.html'));

  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.use((req, res) => {
  res.send('You typed wrong address');
});

app.listen(PORT, () => {
  console.log('Server is running');
});
