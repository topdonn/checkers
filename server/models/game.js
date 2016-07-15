/* eslint-disable max-len, comma-spacing, no-unused-vars, no-shadow, consistent-return, func-names,  */
import mongoose from 'mongoose';
import _ from 'underscore';
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  player1: { type: mongoose.Schema.ObjectId, ref: 'Player' },
  player2: { type: mongoose.Schema.ObjectId, ref: 'Player' },
  board: [{ x: Number, y: Number, player: String, king: Boolean }],
  currentPlayer: {type: String, default: 'P1', enum: ['P1', 'P2']},
  gameWon: {type: Boolean, default: false },
});

gameSchema.methods.populate = function () {
  // Pieces On The Board
  this.board.push({ x: 1, y: 8, player: 'P1', king: false });
  this.board.push({ x: 3, y: 8, player: 'P1', king: false });
  this.board.push({ x: 5, y: 8, player: 'P1', king: false });
  this.board.push({ x: 7, y: 8, player: 'P1', king: false });
  this.board.push({ x: 2, y: 7, player: 'P1', king: false });
  this.board.push({ x: 4, y: 7, player: 'P1', king: false });
  this.board.push({ x: 6, y: 7, player: 'P1', king: false });
  this.board.push({ x: 8, y: 7, player: 'P1', king: false });
  this.board.push({ x: 1, y: 6, player: 'P1', king: false });
  this.board.push({ x: 3, y: 6, player: 'P1', king: false });
  this.board.push({ x: 5, y: 6, player: 'P1', king: false });
  this.board.push({ x: 7, y: 6, player: 'P1', king: false });
  this.board.push({ x: 2, y: 1, player: 'P2', king: false });
  this.board.push({ x: 4, y: 1, player: 'P2', king: false });
  this.board.push({ x: 6, y: 1, player: 'P2', king: false });
  this.board.push({ x: 8, y: 1, player: 'P2', king: false });
  this.board.push({ x: 1, y: 2, player: 'P2', king: false });
  this.board.push({ x: 3, y: 2, player: 'P2', king: false });
  this.board.push({ x: 5, y: 2, player: 'P2', king: false });
  this.board.push({ x: 7, y: 2, player: 'P2', king: false });
  this.board.push({ x: 2, y: 3, player: 'P2', king: false });
  this.board.push({ x: 4, y: 3, player: 'P2', king: false });
  this.board.push({ x: 6, y: 3, player: 'P2', king: false });
  this.board.push({ x: 8, y: 3, player: 'P2', king: false });
};

gameSchema.methods.isOccupied = function (x, y) {
  return this.board.some(space => space.x === x && space.y === y);
};

gameSchema.methods.isValid = function (orig, dest) {
  // If orig/dest is off the board
  if ([orig.x, orig.y, dest.x, dest.y].some(element => element > 8 || element < 1)) { return false; }
  // If the orig or dest is occupied, return false
  if (!this.isOccupied(orig.x, orig.y) || this.isOccupied(dest.x, dest.y)) { return false; }

  const diffx = orig.x - dest.x;
  const diffy = orig.y - dest.y;

  if (Math.abs(diffx) !== 1 || Math.abs(diffy) !== 1) { return false; }

  // Is it a king - Is so return true
  const piece = this.board.find(pieces => pieces.x === orig.x && pieces.y === orig.y);
  if (piece.king) { return true; }

  if ((piece.player === 'P1' && diffy === 1) || (piece.player === 'P2' && diffy === -1)) { return true; }
};

gameSchema.methods.move = function (move, cb) {
  if (this.isValid(move.orig, move.dest)) {
    const piece = this.board.find(piece => piece.x === move.orig.x && piece.y === move.orig.y);
    piece.x = move.dest.x;
    piece.y = move.dest.y;
    this.gameProgression();
    cb(null, this);
  } else {
    cb(new Error('Invalid Move'), this);
  }
};

gameSchema.methods.isJumpValid = function (player, orig, dest) {
  // If orig/dest is off the board
  if ([orig.x, orig.y, dest.x, dest.y].some(element => element > 8 || element < 1)) { return false; }
  // If the orig or dest is occupied, return false
  if (!this.isOccupied(orig.x, orig.y) || this.isOccupied(dest.x, dest.y)) { return false; }

  const diffx = orig.x - dest.x;
  const diffy = orig.y - dest.y;
  if (Math.abs(diffx) !== 2 || Math.abs(diffy) !== 2) { return false; }

  const jumpedx = orig.x + (diffx > 0 ? -1 :  1);
  const jumpedy = orig.y + (diffy > 0 ? -1 :  1);

  // Find the jumped piece
  const jumpedPiece = this.board.find(piece => piece.x === jumpedx && piece.y === jumpedy);
  if (!jumpedPiece || jumpedPiece.player === player) { return false };

  // Is it a king - If so return the piece
  const piece = this.board.find(pieces => pieces.x === orig.x && pieces.y === orig.y);
  if (piece.king) { return { x: jumpedx, y: jumpedy }; }

  // Given it's not a king, if the jump is being made in the right direction for that player, return the jumped piece
  if ((piece.player === 'P1' && diffy === 2) || (piece.player === 'P2' && diffy === -2)) { return { x: jumpedx, y: jumpedy }; }
  return false;
};

gameSchema.methods.jump = function (jump, cb) {
  const jumpedPiece = this.isJumpValid(jump.player, jump.orig, jump.dest);
  if (!jumpedPiece) {
    return cb(new Error('Invalid Jump'), this);
  }
  const jumpingPiece = this.board.find(piece => piece.x === jump.orig.x && piece.y === jump.orig.y);
  jumpingPiece.x = jump.dest.x;
  jumpingPiece.y = jump.dest.y;
  this.board = this.board.filter((piece) => !(piece.x === jumpedPiece.x && piece.y === jumpedPiece.y ));
  this.gameProgression();
  cb(null, this);
};

gameSchema.methods.gameProgression = function () {
  this.alternateTurns();
  this.checkForKings();
  this.checkForWin();
}

gameSchema.methods.alternateTurns = function () {
  if (this.currentPlayer === 'P1'){
    this.currentPlayer = 'P2';
  } else {
    this.currentPlayer = 'P1';
  }
}

gameSchema.methods.checkForKings = function () {
  this.board.filter((piece) => {
    return ((piece.player === 'P1' && piece.y === 1 && piece.king === false) || (piece.player === 'P2' && piece.y === 8 && piece.king === false))
  }).map(piece => piece.king = true);
};

gameSchema.methods.checkForWin = function () {
  const player1Victory = this.board.every(piece => piece.player === 'P1');
  const player2Victory = this.board.every(piece => piece.player === 'P2');
  this.gameWon = (player1Victory || player2Victory);
};

module.exports = mongoose.model('Game', gameSchema);
