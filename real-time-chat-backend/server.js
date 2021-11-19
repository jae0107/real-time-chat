import express, { query } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import mongoData from "./mongoData.js";

// app config
const app = express();
const port = process.env.PORT || 8002;

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
    const id = req.query.id;
    const newMessage = req.body;

    mongoData.updateOne(
        {_id: query.id},
        {$push: {conversation: req.body}},
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



// listen
app.listen(port, () => console.log(`listening on localhost:${port}`));