require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { notFound, handleError } = require('./middlewares');
const routes = require('./routes');
const logger = require('./config/logger');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.get("/veevi-test", (req, res) => {

  res.send("Hello World")
})

app.use(
  express.urlencoded({
    limit: '50mb',
    extended: false,
  })
);
app.use(logger);

app.use('/api/v1', routes);

app.use(express.static('static'));

app.use(notFound);
app.use(handleError);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
