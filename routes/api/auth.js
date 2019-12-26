const express = require('express');
const router = express.Router(); // router

const bcrypt = require('bcryptjs');

const auth = require('../../middleware/auth');

const jwt = require('jsonwebtoken');

const config = require('config');

const { check, validationResult } = require('express-validator'); // from documentation

const User = require('../../models/User');

// router.get -- using for get requests
// @route   GET api/auth
// @desc    Test route
// @access  Public -- dont need a token for this route
// make this route protected with adding auth as param
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // leave out the password
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body); // body parser is included in express

    const { email, password } = req.body;

    try {
      // see if the user exists not
      let user = await User.findOne({ email });

      if (!user) {
        // bad request
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // see if the password matches
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

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
