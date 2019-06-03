const express = require("express");
const expressjwt = require("express-jwt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const users = [
  {
    id: 1,
    username: "admin",
    password: "admin"
  },
  {
    id: 2,
    username: "guest",
    password: "guest"
  }
];

const PORT = 3001;

const app = express();

const jwtCheck = expressjwt({
  secret: "mySuperSecret"
});

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("GET > '/'");

  res.status(200).send("API is OK");
});

app.get("/public", (req, res) => {
  console.log("GET > '/public'");

  res.send("Public data");
});

app.get("/private", jwtCheck, (req, res) => {
  console.log("GET > '/private'");

  res.send("Private data");
});

app.post("/login", (req, res) => {
  console.log("POST > '/login'");

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("Username and password are required");
  }

  const user = users.find(user => {
    return user.username === username && user.password === password;
  });

  if (!user) {
    res.status(401).send("User not found");
  }

  const token = jwt.sign(
    {
      sub: user.id,
      username: user.username
    },
    "mySuperSecret",
    { expiresIn: "3 Hours" },
  );

  res.send({ token });
});

app.get("*", (req, res) => {
  res.sendStatus(404);
});

const server = app.listen(PORT, () => {
  console.log(`API is running on ${server.address().port}`);
});
