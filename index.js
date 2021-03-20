const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5000;


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.bjf0d.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const playerCollection = client.db("playerInformation").collection("players");
  // perform actions on the collection object
//   client.close();
  console.log('Crud Db working');
  app.post('/addFakePlayer', (req, res) => {
      const players = req.body;
      playerCollection.insertMany(players)
      .then( result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/players', (req, res) => {
    playerCollection.find({})
    .toArray( (err, documents) => {
        res.send(documents)
    })
  })

  app.get('/player/:id', (req, res) => {
      playerCollection.find({_id : ObjectId(req.params.id)})
      .toArray( (err, documents) => {
          res.send(documents)
      })
  })

  app.delete('/playerDelete/:id', (req, res) => {
      playerCollection.deleteOne({_id : ObjectId(req.params.id)})
      .then(result => {
          res.send(result.deletedCount > 0)
      })
  })
});


app.get('/', (req, res) => {
    res.send('Hello React Redux Crud!!!')
})

app.listen(port);