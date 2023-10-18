const express = require("express");
const cors = require("cors");
const brands = require("./brands.json");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hzybyvu.mongodb.net/?retryWrites=true&w=majority`;

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

    const productCollections = client
      .db("techTitanDB")
      .collection("ProductCollections");

    app.get("/brand/:name", async (req, res) => {
      const brand = req.params.name;
      const query = { brand: brand };
      const find = productCollections.find(query);
      const result = await find.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollections.findOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const data = req.body;
      const result = await productCollections.insertOne(data);
      res.send(result);
    });

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedData = {
        $set: {
          name : data.name,
          brand : data.brand,
          type : data.type,
          price : data.price,
          rating : data.rating,
          image : data.image,
          detail : data.detail
        }
      };
      const result = await productCollections.updateOne(filter, updatedData);
      res.send(result)
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
  res.send("Tech Titan server is running");
});

app.get("/brands", (req, res) => {
  res.send(brands);
});

app.get("/brands/:id", (req, res) => {
  const id = req.params.id;
  const find = brands.find((brand) => brand.id === parseFloat(id));
  res.send(find);
});

app.listen(port, () => {
  console.log(`Tech Titan server is running on port: ${port}`);
});
