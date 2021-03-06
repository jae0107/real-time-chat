import express, { query } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import mongoData from "./mongoData.js";
import Pusher from 'pusher';
import * as path from 'path'

// app config
const app = express();
const port = process.env.PORT || 8000;

const pusher = new Pusher({
    appId: "1300787",
    key: "d2a9315a17a092f816e8",
    secret: "de10ca277ee4d47c2894",
    cluster: "ap4",
    useTLS: true
});

// middlewares
app.use(express.json());
app.use(cors());

// db config
const mongoURI = 'mongodb+srv://admin:0m2ui6rQnotuPykP@cluster0.vo0sy.mongodb.net/realTimeChat?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
/*mongoose.connect(
    mongoURI,
    async(err)=>{
        if(err) throw err;
        console.log("conncted to db")
    }
)*/

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

mongoose.connection.once('open', () => {
    console.log('DB Connected');

    const changeStream = mongoose.connection.collection('conversations').watch();

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            pusher.trigger('channels', 'newChannel', {
                'change': change
            });

        } else if (change.operationType === 'update') {
            pusher.trigger('conversation', 'newMessage', {
                'change': change
            });

        } else {
            console.log('Error triggering Pusher');
        }
    });
});

// api routers
app.get('/', (req, res) => res.status(200).send('hello world'));

app.post('/new/channel', (req, res) => {
    const dbData = req.body;

    mongoData.create(dbData, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
});

app.get('/get/channelList', (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            let channels = [];

            data.map((channelData) => {
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }
                channels.push(channelInfo);
            });

            res.status(200).send(channels);
        }
    });
});

app.post('/new/message', (req, res) => {
    mongoData.updateOne(
        { _id: req.query.id },
        { $push: { conversation: req.body } },
        (err, data) => {
            if (err) {
                console.log('Error saving message...');
                console.log(err);
                res.status(500).send(err);

            } else {
                res.status(201).send(data);
            }
        }
    )
});

app.get('/get/data', (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

app.get('/get/conversation', (req, res) => {
    const id = req.query.id;

    mongoData.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// listen
app.listen(port, () => console.log(`listening on localhost:${port}`));