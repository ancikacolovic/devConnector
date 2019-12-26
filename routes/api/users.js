const express = require('express');
const router = express.Router(); // router

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const config = require('config');

const { check, validationResult } = require('express-validator'); // from documentation

// get the user model
const User = require('../../models/User');

// router.get -- using for get requests
// @route   POST api/users
// @desc    Register user
// @access  Public -- dont need a token for this route
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),

    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body); // body parser is included in express

    const { name, email, password } = req.body;

    try {
      // see if the user exists
      let user = await User.findOne({ email });

      if (user) {
        // bad request
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg', // ?
        d: 'mm' // default image; user icon
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt the password
      const salt = await bcrypt.genSalt(10); // 10 is recommended in docs

      //hashing the password
      user.password = await bcrypt.hash(password, salt);

      await user.save(); // this saves a user in the DB
      // anything that returns a promise
      // we should put await in front of that

      // Return the jsonwebtoken --> because in the front end when a user registers
      // we want them to be logged in right away, and you need a webtoken for that
      const payload = {
        user: {
          id: user.id // user is saved in DB and we will have that info about id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      //res.send('User registered!');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
