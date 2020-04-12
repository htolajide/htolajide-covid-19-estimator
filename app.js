'use-strict'
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path')

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// create a write stream (in append mode)
const requestLogStream = fs.createWriteStream(path.join(__dirname, 'request.json'), { flags: 'a' })

const app = express();
app.use(morgan('dev'));
// app.use(morgan(':method :url :status :total-time[digits]', { stream: accessLogStream }))
app.use(morgan(':method :url :status :response-time[digits] ms', { stream: accessLogStream }))
app.use(morgan(':method :url :status :response-time[digits] ms', { stream: requestLogStream }))

app.get('/hello/:name', (req, res) => {
  //res.setHeader('content-type', 'text/xml')
  res.status(200).json({ 'hello': req.params.name });
});

app.listen(4500, () => console.log('Ready.'));