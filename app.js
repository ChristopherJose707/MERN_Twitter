const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require('body-parser');
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");
const passport = require('passport');
const app = express();
const db = require('./config/keys').mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully!!"))
  .catch((err) => console.log(err))
;

app.use(bodyParser.urlencoded({extended: false})); // ORDER OF THIS MATTERS 
app.use(bodyParser.json());  // ORDER OF THIS MATTERS 
app.use(passport.initialize());
require('./config/passport')(passport);

// integrates route with app
app.use("/api/users", users);
app.use("/api/tweets", tweets);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

