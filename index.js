const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// * Middleware:
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdnsrak.mongodb.net/?retryWrites=true&w=majority`;

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


    const classesCollection = client.db("goalGurusDb").collection("classes");
    const coachesCollection = client.db("goalGurusDb").collection("coaches");
    const cartsCollection = client.db("goalGurusDb").collection("carts");

    // * Classes api:
    app.get("/classes" , async(req , res) => {
        const result = await classesCollection.find().toArray();
        res.send(result);
    });

    // * Coaches Api:
    app.get("/coaches" , async(req , res) => {
        const result = await coachesCollection.find().toArray();
        res.send(result);
    });

    // * Carts api:
    app.post("/carts" , async(req , res) => {
      const item = req.body;
      console.log(item);
      const result = await cartsCollection.insertOne(item);
      res.send(result);
    })


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
  res.send("GoalGurus server is running");
});

app.listen(port, () => {
  console.log(`GoalGurus server is running on port : ${port}`);
});
