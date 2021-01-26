const express = require('express');
const app = express();
const Port = 5000;
const mongoose = require('mongoose');
const connectDB = require('./config/connect');

app.use(express.json({ extended: false }));

connectDB();

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(Port, (err) => {
  if (err) console.log('server not running');
  else console.log(`sever running at ${Port}`);
});
