const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const User = require('../../models/User');
const passport = require('passport');

// private auth route
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      handle: req.user.handle,
      email: req.user.email,
    });
  }
);


router.post('/register', (req, res) => {
  // const{errors, isValid} = validateRegisterInput(req.body);
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  User.findOne({handle: req.body.handle})
    .then(user => {
      if(user) { // if user exists
        errors.handle = "User already exists";
        return res.status(400).json(errors);
      } else {
        // user doesn't exist, save the user to database
        const newUser = new User({
          handle: req.body.handle,
          email: req.body.email,
          password: req.body.password
        });
        // Change given password to a salted and encrypted password hash
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err,hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                const payload = {id: user.id, handle: user.handle };

                jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) =>{
                  res.json({
                    success: true,
                    token: "Bearer " + token
                  })
                })
              })
              .catch(err => console.log(err));
          })
        })
      }
    })
})

router.post('/login', (req, res) => {
  // const { errors, isValid } = validateLoginInput(req.body);
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
    .then(user => {
      if (!user) {
        errors.handle = "This user does not exist"
        return res.status(404).json(errors);
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {id: user.id, handle: user.handle};

            jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, 
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              }
            )
          } else {
            errors.password = "Incorrect password"
            return res.status(400).json(errors);
          }
        })
    })
})


router.get("/test", (req, res) => res.json({msg: "This is the users route"}));
module.exports = router;