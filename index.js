const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    const bookingCollection = client.db('embark-escapes-db').collection('bookings')
    const wishCollection = client.db('embark-escapes-db').collection('wishlist')

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
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await packageCollection.findOne(query);
            res.send(result)
        })
        app.get('/guides/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await guideCollection.findOne(query);
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
        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        });
        app.get('/wishlist', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const result = await wishCollection.find(query).toArray();
            res.send(result);
        });
        app.get('/stories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await storyCollection.findOne(query);
            res.send(result)
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });
        app.post('/stories', async (req, res) => {
            const story = req.body;
            const result = await storyCollection.insertOne(story);
            res.send(result);
        });
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });
        app.post('/wishlist', async (req, res) => {
            const wish = req.body;
            const result = await wishCollection.insertOne(wish);
            res.send(result);
        });

        app.post('/packages', async (req, res) => {
            const pack = req.body;
            const result = await packageCollection.insertOne(pack);
            res.send(result);
        })
        app.post('/guides', async (req, res) => {
            const guide = req.body;
            const result = await guideCollection.insertOne(guide);
            res.send(result);
        })

        app.get('/guides', async (req, res) => {
            const result = await guideCollection.find().toArray();
            res.send(result)
        })
        app.get('/users/guide/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let guide = false;
            if (user) {
                guide = user?.role === 'guide';
            }
            res.send({ guide });
        })
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let admin = false;
            if (user) {
                admin = user?.role === 'admin';
            }
            res.send({ admin });
        })
        app.patch('/guides/:email', async (req, res) => {
            const email = req.params.email;
            const guide = req.body;
            const filter = { email: email };
            const updatedDoc = {
                $set: {
                    name: guide.name,
                    image: guide.image,
                    phone: guide.phone,
                    email: guide.email,
                    education: guide.email,
                    skills: guide.skills,
                    experience: guide.experience
                }
            }
            const result = await guideCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })
        app.patch('/users/:email', async (req, res) => {
            const email = req.params.email;
            const guide = req.body;
            const filter = { email: email };
            const updatedDoc = {
                $set: {
                    role: guide.role
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);
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