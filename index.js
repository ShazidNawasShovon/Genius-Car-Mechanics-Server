const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijm0a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Genius-Car-Mechanics");
    const servicesCollection = database.collection("Services");
    // GET Multiple API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    // GET SINGLE SERVICE API
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const service = await servicesCollection.findOne(query);
      res.json(service);
    });
    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);

      const result = await servicesCollection.insertOne(service);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });
    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Genius Server Now Or Never");
});
app.listen(port, () => {
  console.log("Running Genius Server on port", port);
});

/*
one time:
1. nodemon globally install
2. mongodb atlas user, access
3. Network access (ip address allow)
Every projects:
1. install mongodb, express, cors, dotenv
2. import (require), mongodb
3. copy uri (connection string)
4. create the client (copy code from atlas)
5. Create or get database access credentials (username, password)
6. create .env file and add DB_USER and DB_PASS as environment variable
7. Make sure you require (import) dotenv
8. Convert URI string to a template string.
9. Add DB_USER and DB_PASS in the connection URI string.
10. Check URI string by using console.log
11. Create async function run and call it by using run().catch(console.dir)
12. add try and finally inside the run function.
13. comment out await client.close() to keep the connection alive
14. add await client.connect(); inside the try block
15. use a console.log after the client.connect to ensure database is connected
*/
