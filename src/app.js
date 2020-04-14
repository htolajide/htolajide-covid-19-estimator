'use-strict';

import '@babel/polyfill';
import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import objXml from 'object-to-xml';
import covid19ImpactEstimator from './estimator';

const logger = require('simple-node-logger').createSimpleLogger();

dotenv.config();
// store the port number
const port = parseInt(process.env.PORT, 10) || 4500;
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.txt'), { flags: 'a' });
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
// app.use(morgan(':method :url :status :total-time[digits]', { stream: accessLogStream }))
app.use(morgan(':method :url :status :total-time[digits]ms', { stream: accessLogStream }));
// app.use(morgan(':method :url :status :response-time[digits] ms', { stream: requestLogStream }))
app.post('/api/v1/on-covid-19', (req, res) => {
// res.setHeader('content-type', 'text/xml')
  const result = covid19ImpactEstimator(req.body);
  if (result) {
    return res.status(200).json(result);
  }
  return res.send('request failed');
});
app.post('/api/v1/on-covid-19/json', (req, res) => {
// res.setHeader('content-type', 'text/xml')
  const result = covid19ImpactEstimator(req.body);
  if (result) {
    return res.status(200).json(result);
  }
  return res.send('request failed');
});

// request with xml response
app.post('/api/v1/on-covid-19/xml', (req, res) => {
// res.setHeader('content-type', 'text/xml')
  res.set('Content-Type', 'application/xml');
  const result = covid19ImpactEstimator(req.body);
  const obj = {
    '?xml version="1.0" encoding="iso-8859-1"?': null,
    result
  };
  if (result) {
    return res.send(objXml(obj));
  }
  return res.send('request failed');
});

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  res.set('Content-Type', 'application/text');
  fs.readFile(path.join(__dirname, 'access.txt'), 'utf8', (err, data) => {
    if (err) res.send('Error reading file');
    else if (data === undefined) res.send('No data');
    else { res.send(data); }
  });
});

app.get('*', (req, res) => { res.end('Covid-19 Estmator!!!'); });
app.listen(port, () => logger.info(`Covid-19 Estimator ready at ${port}`));

module.exports = app;
