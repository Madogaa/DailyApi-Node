const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Event = require("../models/Event");
const { Op } = require("sequelize");
const dayjs = require("dayjs");
require('dotenv').config();

const router = express.Router();

// Asegurarse de que las rutas de eventos requieran autenticación

router.post("/create", async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    // Obtener el ID del usuario desde el token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, `${process.env.TOKEN_KEY}`);
    const userId = decodedToken.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      userId: user.id,
    });

    res.status(200).json({ createdEvent: event });
  } catch (error) {
    res.status(500).json({ error: "Error creating event." });
  }
});

router.get("/list", async (req, res) => {
  try {
    // Obtener el ID del usuario desde el token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, `${process.env.TOKEN_KEY}`);
    const userId = decodedToken.userId;

    const user = await User.findByPk(userId, {
      include: [{ model: Event }],
    });

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    res.status(200).json(user.events);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving events." });
  }
});

router.get("/list/month", async (req, res) => {
  const { month, year } = req.query;
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, `${process.env.TOKEN_KEY}`);
  const userId = decodedToken.userId;

  try {
    const startDate = dayjs(new Date(year, month - 1, 1)).format("YYYY-MM-DD"); // Restamos 1 al mes porque en JavaScript los meses van de 0 a 11
    const endDate = dayjs(new Date(year, month, 0)).format("YYYY-MM-DD"); // Obtenemos el último día del mes

    const events = await Event.findAll({
      where: {
        userId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } },
            ],
          },
        ],
      },
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener eventos." });
  }
});

router.delete("/delete/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, `${process.env.TOKEN_KEY}`);
  const userId = decodedToken.userId;

  try {
    const event = await Event.findOne({
      where: {
        userId,
        id: eventId,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    await event.destroy();
    return res.status(200).json({ deletedEvent: event });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
