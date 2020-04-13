'use-strict'
import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import covid19ImpactEstimator from './src/estimator';
import objXml from 'object-to-xml';

dotenv.config();
//store the port number

const port = parseInt(process.env.PORT, 10) || 4500;
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// create a write stream (in append mode)
// const requestLogStream = fs.createWriteStream(path.join(__dirname, 'request.json'), { flags: 'a' })

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
// app.use(morgan(':method :url :status :total-time[digits]', { stream: accessLogStream }))
app.use(morgan(':method     :url    :status     :response-time[digits]ms', { stream: accessLogStream }))
// app.use(morgan(':method :url :status :response-time[digits] ms', { stream: requestLogStream }))

app.post('/api/v1/on-covid-19', (req, res) => {
  //res.setHeader('content-type', 'text/xml')
  const result = covid19ImpactEstimator(req.body);
  if(result){
    return res.status(200).json({ 
      message: 'request successful',
      result: result
    });
  }
  return res.send('request failed');
});
app.post('/api/v1/on-covid-19/json', (req, res) => {
    //res.setHeader('content-type', 'text/xml')
    const result = covid19ImpactEstimator(req.body);
    if(result){
      return res.status(200).json({ 
        message: 'request successful',
        result: result
      });
    }
    return res.send('request failed');
  });

  // request with xml response
  app.post('/api/v1/on-covid-19/xml', (req, res) => {
    //res.setHeader('content-type', 'text/xml')
    res.set('Content-Type', 'application/xml');
    const result = covid19ImpactEstimator(req.body);
    const obj = { 
      '?xml version=\"1.0\" encoding=\"iso-8859-1\"?' : null,
      result: result
    }
    if(result){
      return res.send(objXml(obj));
    }
    return res.send('request failed');
  });

  app.get('/api/v1/on-covid-19/logs', function (req, res) {
    fs.readFile( __dirname + "/" + "access.log", 'utf8', function (err, data) {
       if(err) {
          res.end('Error reading file') }
       else if (data === undefined){
          res.end('No data')}
       else {
        res.end(data);
       }
    });
 })
app.get('*', (req, res) => {res.end('Covid-19 Estmator!!!')});
app.listen(port, () => console.log(`Covid-19 Estimator ready at ${port}`));