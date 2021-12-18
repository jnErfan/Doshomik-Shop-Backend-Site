const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient } = require("mongodb");
const fileUpload = require("express-fileupload");
require("dotenv").config();

app.use(cors());
app.use(express());
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

  console.log("Connected");
});
app.listen(port, () => console.log("Server Running At Port", port));
