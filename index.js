const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjzgz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("result-analysis");
    const resultCollection = database.collection("results");

    console.log("database connected successfully");

    // Results GET API
    app.get("/results", async (req, res) => {
      const cursor = resultCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // single student resuls GET API
    app.get("/results/:studentId", async (req, res) => {
      const studentId = req.params.studentId;
      const query = { studentId: studentId };
      const result = await resultCollection.findOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is Ready to work....");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
