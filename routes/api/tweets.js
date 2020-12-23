const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Tweet = require('../../models/Tweet');
const validateTweetInput = require('../../validation/tweets');

// Retrieve All Tweets
router.get('/', (req, res) => {
  Tweet.find()
    .sort({date: -1})
    .then(tweets => res.json(tweets))
    .catch(err => res.status(404).json({notweetsfound: 'No tweets found'}));
})

// Retrieve Single User tweets
router.get('/user/:user_id', (req, res) => {   // url: localhost:5000/api/tweets/user/:user_id
  Tweet.find({user: req.params.user_id})
    .then(tweets => res.json(tweets))
    .catch(err => res.status(404).json({notweetsfound: 'No tweets found for this user'}))
})

// Retrieve an individual tweet 
router.get('/:id', (req, res) => { // url: localhost:5000/api/tweets/:id
  Tweet.findById(req.params.id)
    .then((tweet) => res.json(tweet))
    .catch((err) =>
      res.status(404).json({ notweetfound: "No tweet found with that ID" })
    );
})

// Protected route for User to post tweets
router.post('/', 
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {
  const {errors, isValid} = validateTweetInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newTweet = new Tweet ({
    text: req.body.text,
    user: req.user.id
  });

  newTweet.save().then(tweet => res.json(tweet));
})



module.exports = router;
