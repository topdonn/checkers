/* eslint-disable new-cap */

import express from 'express';
import Player from '../models/player';
const router = module.exports = express.Router();

// index
router.post('/', (req, res) => {
  Player.create(req.body, (err, player) => {
    res.send({ player });
  });
});
