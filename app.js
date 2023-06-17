const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const app = express();

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648c495127881982dddefcfe', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(routes);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
