/* eslint-disable new-cap */

import express from 'express';
import Player from '../models/player';
const router = module.exports = express.Router();

// index
router.post('/', (req, res) => {
  console.log('WE MADE IT TO THE POST');
  console.log(req.body);
  Player.create(req.body, (err, player) => {
    console.log('player:',player);
    res.send({ player });
  });
});
