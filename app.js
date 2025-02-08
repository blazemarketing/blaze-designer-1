const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://blazemarketingm.blazemarketingmedia.com'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));


app.use(express.static(path.join(__dirname, '..', 'public'))); 

const uri = 'mongodb+srv://dhruva:dhruva123@backenddb.klh5v.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB';
let db;

MongoClient.connect(uri)
    .then(client => {
        db = client.db('landing_page');
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

app.get('/', (req, res) => {
    
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html')); 
});

app.post('/submit-form', (req, res) => {
    const { name, phone, email, city, state } = req.body;

    if (!name || !phone || !email || !city || !state) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    db.collection('form_details').insertOne({
        name,
        phone,
        email,
        city,
        state,
        date: new Date()
    })
    .then(() => {
        res.status(200).json({ success: true, message: 'Form submitted successfully' });
    })
    .catch(err => {
        console.error('Error inserting form data', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    });
});


app.get('/get-details', (req, res) => {
    db.collection('form_details').find().toArray()
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        console.error('Error fetching form details', err);
        res.status(500).send('Internal Server Error');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
