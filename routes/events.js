const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Event = require('../models/Event');

const router = express.Router();

// Asegurarse de que las rutas de eventos requieran autenticación

router.post('/create', async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    // Obtener el ID del usuario desde el token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'your-secret-key');
    const userId = decodedToken.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      userId: user.id,
    });

    res.status(201).json({ message: 'Event created successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating event.'});
  }
});

router.get('/list', async (req, res) => {
  try {
    // Obtener el ID del usuario desde el token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'your-secret-key');
    const userId = decodedToken.userId;

    const user = await User.findByPk(userId, {
      include: [{ model: Event }],
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    res.status(200).json(user.events);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving events.' });
  }
});

module.exports = router;
