const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.get('/authenticate', async (req, res) => {
  try {
    // Obtener el ID del usuario desde el token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'your-secret-key');
    const userId = decodedToken.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      const authorized = false;
      return res.status(401).json({ authorized });
    }
    const authorized = true;
    res.status(200).json({ authorized });
  } catch (err) {
    console.log(err.message);
    const authorized = false;
    res.status(401).json({ authorized });
  }
});


router.post('/register', async (req, res) => {
  try {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])(?=.{12,})/;
    const { username, password } = req.body;

    const isValidPassword = passwordRegex.test(password);
    if(!isValidPassword){
      return res.status(401).json({ error: 'Password needs: 12 character of which min. 1 capital, lower and special' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    const newUser = await User.create({ username, password });

    const token = jwt.sign({ userId: newUser.id }, 'your-secret-key', {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: 'Error registering user' + error.message });
  }
});

router.get('/test', async (req, res) => {
  try {
    res.status(200).json({ msg : "hola" });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'No user found with that Name' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id }, 'your-secret-key', {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in.' });
    console.log(error.message)
  }
});

module.exports = router;
