const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const fileUpload = require("express-fileupload");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send(
    `<h1 style="text-align:center">Welcome To Doshomik Shop Backend Server </h1>`
  );
});
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qyw7u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const database = client.db("doshomik_shop");
  const usersCollection = database.collection("users");
  const membershipCollection = database.collection("memberships");

  app.get("/memberShips", async (req, res) => {
    const membership = await membershipCollection.find({}).limit(6).toArray();
    res.send(membership);
  });
  app.get("/allMemberShips", async (req, res) => {
    const membership = await membershipCollection.find({}).toArray();
    res.send(membership);
  });

  app.get("/memberShips/:id", async (req, res) => {
    const params = req.params.id;
    const query = { _id: ObjectId(params) };
    const result = await membershipCollection.find(query).toArray();
    res.send(result);
  });

  // Create Email Password Information
  app.post("/users", async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.json(result);
    console.log(result);
  });

  // Google Facebook And Github User Information
  app.put("/users", async (req, res) => {
    const user = req.body;
    console.log(user);
    const query = { email: user?.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await usersCollection.updateOne(query, updateDoc, options);
    res.json(result);
    console.log(result);
  });

  //Get All User
});
app.listen(port, () => console.log("Server Running At Port", port));
