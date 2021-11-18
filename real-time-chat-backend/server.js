import express from 'express';
import  mongoose  from 'mongoose';
import cors from 'cors';

// app config
const app = express();
const port = process.env.PORT || 8002;

// middlewares
app.use(express.json());
app.use(cors());

// db config

// api routers
app.get('/', (req, res) => res.status(200).send('hello world'));

// listen
app.listen(port, () => console.log(`listening on localhost:${port}`));