/* eslint-disable new-cap */

import express from 'express';
import Player from '../models/player';
import Game from '../models/game';
const router = module.exports = express.Router();

// create
router.post('/', (req, res) => {
  Game.create(req.body, (err, game) => {
    game.populate();
    game.save((err,game) => {
      res.send({ game });
    })
  });
});

router.get('/:id', (req, res) => {
  console.log('We are in game get', req.params.id);
  Game.findById(req.params.id, (err, game) => {
    console.log('finding the game..', game);
    res.send({ game });
  })
});
