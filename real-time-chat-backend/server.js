import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// app config
const app = express();
const port = process.env.PORT || 8002;

// middlewares
app.use(express.json());
app.use(cors());

// db config
const mongoURI = 'mongodb+srv://ghjgjh:Jh120301!!@cluster0.vo0sy.mongodb.net/realTimeChat?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// api routers
app.get('/', (req, res) => res.status(200).send('hello world'));

// listen
app.listen(port, () => console.log(`listening on localhost:${port}`));