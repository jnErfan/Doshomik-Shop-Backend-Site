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
  const orderMembershipCollection = database.collection("orderMemberships");

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
  app.get("/allUsers", async (req, res) => {
    const users = await usersCollection.find({}).toArray();
    res.send(users);
  });

  // Get One Users
  app.get("/users/:email", async (req, res) => {
    const params = req.params.email;
    const query = { email: params };
    const result = await usersCollection.find(query).toArray();
    res.send(result);
  });

  //Make Admin
  app.put("/makeAdmin/:email", async (req, res) => {
    const adminEmail = req.params.email;
    const query = { email: adminEmail };
    const updateDoc = { $set: { position: "Admin" } };
    const result = await usersCollection.updateOne(query, updateDoc);
    res.json(result);
  });
  //Make Moderator
  app.put("/makeModerator/:email", async (req, res) => {
    const adminEmail = req.params.email;
    const query = { email: adminEmail };
    const updateDoc = { $set: { position: "Moderator" } };
    const result = await usersCollection.updateOne(query, updateDoc);
    res.json(result);
  });
  //Make User
  app.put("/makeUser/:email", async (req, res) => {
    const adminEmail = req.params.email;
    const query = { email: adminEmail };
    const updateDoc = { $set: { position: "User" } };
    const result = await usersCollection.updateOne(query, updateDoc);
    res.json(result);
  });

  // Membership Orders Stored
  app.post("/membershipOrder", async (req, res) => {
    const user = req.body;
    const result = await orderMembershipCollection.insertOne(user);
    res.json(result);
    console.log(result);
  });

  app.get("/membershipOrder", async (req, res) => {
    const users = await orderMembershipCollection.find({}).toArray();
    res.send(users);
  });

  // Find Customer Ordered
  app.get("/myOrder/:email", async (req, res) => {
    const emailMatch = req.params.email;
    const query = { email: emailMatch };
    const result = await orderMembershipCollection.find(query).toArray();
    res.send(result);
  });

  // Cancel Order
  app.delete("/deleteOrder/:Id", async (req, res) => {
    const id = req.params.Id;
    const query = { _id: ObjectId(id) };
    const result = await orderMembershipCollection.deleteOne(query);
    res.send(result);
  });
});
app.listen(port, () => console.log("Server Running At Port", port));
