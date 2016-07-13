/* eslint-disable max-len, comma-spacing */
import Player from '../models/player';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  player1: { type: mongoose.Schema.ObjectId, ref: 'Player' },
  player2: { type: mongoose.Schema.ObjectId, ref: 'Player' },
  board: { type: Array, default: [] },
});

gameSchema.methods.populate = function() {
  this.board = [['X','','X','','X','','X',''], ['','X','','X','','X','','X'], ['X','','X','','X','','X',''],['','','','','','','',''],['','','','','','','',''],['O','','O','','O','','O',''],['','O','','O','','O','','O'],['O','','O','','O','','O','']];
};
module.exports = mongoose.model('Game', gameSchema);
