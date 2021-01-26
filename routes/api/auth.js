const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

//User Model

let User = require('../../models/user');

router.use(bodyParser.json());

// @route  POST  api/auth
// @desc   Auth user
// @access Public

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password').exists(),
  ],
  async function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    //validation

    if (!email || !password) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'please enter all fields' }] });
    }
    try {
      //check if user exist

      await User.findOne({ email }).then((user) => {
        if (!user)
          return res
            .status(400)
            .json({ errors: [{ msg: 'email or password invalid' }] });

        //validate password

        bcrypt.compare(password, user.password).then((isMatch) => {
          if (!isMatch)
            return res
              .status(400)
              .json({ errors: [{ msg: 'password or email invalid' }] });

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
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('server Error');
    }
  }
);

// @route  GET  api/auth/user
// @desc   Get user
// @access Private

router.get('/user', auth, async (req, res) => {
  try {
    await (await User.findById(req.user.id)).then((user) => res.json(user));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
