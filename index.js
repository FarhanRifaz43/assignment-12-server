const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0zrhnww.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const packageCollection = client.db('embark-escapes-db').collection('tourPackages')
const guideCollection = client.db('embark-escapes-db').collection('guides')

async function run() {
  try {

    app.get('/packages', async(req, res) => {
        const result = await packageCollection.find().toArray();
        res.send(result)
    })
    app.get('/guides', async(req, res) => {
        const result = await guideCollection.find().toArray();
        res.send(result)
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('assignment-12 server is running')
  })
  
  app.listen(port, () => {
    console.log(`assignment-12 is running on port ${port}`);
  })