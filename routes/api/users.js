const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { check, validationResult } = require('express-validator');

let User = require('../../models/user');

// @route  POST api/users
// @desc   register
// @access Public

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),

    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more caracters'
    ).isLength({ min: 6 }),
  ],

  async function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      //check if user exist

      await User.findOne({ email }).then((user) => {
        if (user)
          return res
            .status(400)
            .json({ errors: [{ msg: 'user already exists' }] });
      });
      // get the avatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      const newUser = new User({
        name,
        email,
        avatar,
        password,
      });

      // Create salt & hash

      await bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then((user) => {
            jwt.sign(
              { id: user.id },
              config.get('jwtSecret'),
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;

                res.json({
                  token,

                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                  },
                });
              }
            );
          });
        });
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('server Error');
    }
  }
);

module.exports = router;
