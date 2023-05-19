const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors({}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.djxbtyf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Shop by category ||||||||||||||||||||||||||||||||||||||||||||||||||||||||

    const sportsCollection = client.db("SuperCar").collection("sportsCars");
    const trucksCollection = client.db("SuperCar").collection("trucks");
    const policeCollection = client.db("SuperCar").collection("police");
    const toysCollection = client.db("SuperCar").collection("allToys");

    // get data sports-car
    app.get("/sports", async (req, res) => {
      const result = await sportsCollection.find({}).toArray();
      res.send(result);
    });
    // get data truck
    app.get("/trucks", async (req, res) => {
      const result = await trucksCollection.find({}).toArray();
      res.send(result);
    });
    // get data police-car
    app.get("/police", async (req, res) => {
      const result = await policeCollection.find({}).toArray();
      res.send(result);
    });

    // find one
    app.get("/sports/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = await sportsCollection.findOne(query);
      res.send(data);
    });
    // find one
    app.get("/trucks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = await trucksCollection.findOne(query);
      res.send(data);
    });
    // find one
    app.get("/police/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = await policeCollection.findOne(query);
      res.send(data);
    });
    // Shop by category ||||||||||||||||||||||||||||||||||||||||||||| END--

    // Add A Toy |||||||||||||||||||||||||||||||||||||||||||||||||||| START--
    app.post("/toys", async (req, res) => {
      const data = req.body;
      const result = await toysCollection.insertOne(data);
      res.send(result);
      console.log("new product", data);
    });

    // get data all toys
    app.get("/toys", async (req, res) => {
      const result = await toysCollection.find({}).toArray();
      res.send(result);
    });

    // get some user update toy data
    app.get("/toys", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    });

    // find one
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = await toysCollection.findOne(query);
      res.send(data);
    });

    // update a toy
    app.put("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateToy = req.body;
      const toys = {
        $set: {
          price: updateToy.price,
          quantity: updateToy.quantity,
          description: updateToy.description
        }
      }
      const result = await toysCollection.updateOne(filter, toys, option);
      res.send(result);
    });

    // delete toys
    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete id", id);
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("SuperCar is running...!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
