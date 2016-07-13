/* eslint-disable no-unused-expressions, no-console, no-unused-vars, comma-spacing, quotes, func-names, prefer-arrow-callback, max-len */
const expect = require('chai').expect;
const sinon = require('sinon');
const Game = require('../../dst/models/game');

describe('Game', () => {
  describe('constructor', () => {
    it('should create a new game', (done) => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.validate(err => {
        expect(err).to.be.undefined;
        expect(g.board).to.be.empty;
        done();
      });
    });
  });
  describe('#populate', () => {
    it('should populate the board', (done) => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.populate();
      g.validate(err => {
        expect(err).to.be.undefined;
        expect(g.board[0]).to.deep.equal(["X","","X","","X","","X",""]);
        expect(g.board[1]).to.deep.equal(["","X","","X","","X","","X"]);
        expect(g.board[2]).to.deep.equal(["X","","X","","X","","X",""]);
        expect(g.board[3]).to.deep.equal(["","","","","","","",""]);
        expect(g.board[4]).to.deep.equal(["","","","","","","",""]);
        expect(g.board[5]).to.deep.equal(["O","","O","","O","","O",""]);
        expect(g.board[6]).to.deep.equal(["","O","","O","","O","","O"]);
        expect(g.board[7]).to.deep.equal(["O","","O","","O","","O",""]);
        done();
      });
    });
  });
});
