"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');

const config = require('./config');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || config.port;

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '1mb', type: '*/*' }));

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(`/`, routes);

app.listen(port,()=>{
    console.log(`${config.appName} listening on port ${port}`);
})
module.exports = app;

