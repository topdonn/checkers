/* eslint-disable new-cap */

import express from 'express';
import Game from '../models/game';
const router = module.exports = express.Router();

// create
router.post('/', (req, res) => {
  Game.create(req.body, (err, game) => {
    game.populate();
    game.save((err2, game2) => {
      res.send({ game: game2 });
    });
  });
});

router.get('/:id', (req, res) => {
  Game.findById(req.params.id, (err, game) => {
    res.send({ game });
  });
});

router.put('/:id/move', (req, res) => {
  Game.findById(req.params.id, (err, game) => {
    game.move(req.body, (err2, updatedGame) => {
      updatedGame.save((err3, savedGame) => {
        res.send({ game: savedGame });
      });
    });
  });
});

router.put('/:id/jump', (req, res) => {
  Game.findById(req.params.id, (err, game) => {
    game.jump(req.body, (err2, updatedGame) => {
      updatedGame.save((err3, savedGame) => {
        res.send({ game: savedGame });
      });
    });
  });
});
