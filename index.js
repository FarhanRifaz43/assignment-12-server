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

// custom middlewares
const verifyToken = (req, res, next) => {
    // console.log('inside verify token', req.headers.authorization);
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
}

const verifyAdmin = async (req, res, next) => {
    const email = req.decoded.email;
    const query = { email: email };
    const user = await userCollection.findOne(query);
    const isAdmin = user?.role === 'admin';
    if (!isAdmin) {
        return res.status(403).send({ message: 'forbidden access' });
    }
    next();
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0zrhnww.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    const packageCollection = client.db('embark-escapes-db').collection('tourPackages')
    const guideCollection = client.db('embark-escapes-db').collection('guides')
    const userCollection = client.db('embark-escapes-db').collection('users')
    const storyCollection = client.db('embark-escapes-db').collection('stories')

    try {

        app.get('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send({ token })
        })

        app.get('/packages', async (req, res) => {
            const result = await packageCollection.find().toArray();
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        })
        app.get('/stories', async (req, res) => {
            const result = await storyCollection.find().toArray();
            res.send(result)
        })
        app.get('/stories/:id', async (req, res) => {
            const id = req.params._id;
            const result = await storyCollection.findOne(id);
            res.send(result)
        })

        app.post('/packages', async (req, res) => {

        })

        app.get('/guides', async (req, res) => {
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