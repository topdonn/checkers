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
        expect(g.board).to.have.length(24);
        expect(g.board.filter((space) => space.x === 1 && space.y === 8 && space.player === 'P1' && space.king === false)).to.have.length(1);
        expect(g.board.filter((space) => space.x === 7 && space.y === 2 && space.player === 'P2' && space.king === false)).to.have.length(1);
        expect(g.board.filter((space) => space.player === 'P1' && space.king === false)).to.have.length(12);
        expect(g.board.filter((space) => space.player === 'P2' && space.king === false)).to.have.length(12);
        done();
      });
    });
  });
  describe('#isOccupied', () => {
    it('it should return true if space is occupied', () => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.populate();
      expect(g.isOccupied(1,1)).to.be.false;
      expect(g.isOccupied(1,2)).to.be.true;
      expect(g.isOccupied(5,5)).to.be.false;
      expect(g.isOccupied(5,6)).to.be.true;
      expect(g.isOccupied(7,7)).to.be.false;
    });
  });
  describe('#isValid', () => {
    it('should return true is a move is valid', () => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.populate();
      expect(g.isValid({ x: 5, y: 5 }, { x: 5, y: 6 })).to.be.false;
      expect(g.isValid({ x: 2, y: 3 }, { x: 1, y: 4 })).to.be.true;
      expect(g.isValid({ x: 7, y: 6 }, { x: 6, y: 5 })).to.be.true;
      expect(g.isValid({ x: 7, y: 8 }, { x: 6, y: 7 })).to.be.false;
      expect(g.isValid({ x: 5, y: 6 }, { x: 6, y: 6 })).to.be.false;
      expect(g.isValid({ x: 8, y: 3 }, { x: 7, y: 2 })).to.be.false;
      expect(g.isValid({ x: 8, y: 3 }, { x: 9, y: 4 })).to.be.false;
    });
  });
  describe('#move', () => {
    it('should move a piece for player 1 from an origin to destination', (done) => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.populate();
      g.move({ player: 'P1', orig: { x: 3, y: 6 }, dest: { x: 4, y: 5 } }, (err1, game) => {
        game.validate(err => {
          expect(err1).to.be.null;
          expect(game.board.filter((space) => space.x === 4 && space.y === 5 && space.player === 'P1' && space.king === false)).to.have.length(1);
          done();
        });
      });
    });
    it('should move a piece for player 2 from an origin to destination', (done) => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.populate();
      g.move({ player: 'P2', orig: { x: 2, y: 3 }, dest: { x: 1, y: 4 } }, (err1, game) => {
        game.validate(err => {
          expect(err1).to.be.null;
          expect(game.board.filter((space) => space.x === 1 && space.y === 4 && space.player === 'P2' && space.king === false)).to.have.length(1);
          done();
        });
      });
    });
    it('should not make an invalid move - piece in the way', (done) => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.populate();
      g.move({ player: 'P1', orig: { x: 2, y: 7 }, dest: { x: 1, y: 6 } }, (err1, game) => {
        game.validate(err => {
          expect(err1).to.be.ok;
          expect(game.board.filter((space) => space.x === 1 && space.y === 6 && space.player === 'P1' && space.king === false)).to.have.length(1);
          expect(game.board.filter((space) => space.x === 2 && space.y === 7 && space.player === 'P1' && space.king === false)).to.have.length(1);
          done();
        });
      });
    });
    it('should not make an invalid move - off the board', (done) => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.populate();
      g.move({ player: 'P2', orig: { x: 8, y: 1 }, dest: { x: 9, y: 2 } }, (err1, game) => {
        game.validate(err => {
          expect(err1).to.be.ok;
          expect(game.board.filter((space) => space.x === 1 && space.y === 4 && space.player === 'P2' && space.king === false)).to.have.length(0);
          expect(game.board.filter((space) => space.x === 8 && space.y === 1 && space.player === 'P2' && space.king === false)).to.have.length(1);
          done();
        });
      });
    });
  });
  describe('#isJumpValid', () => {
    it('should return true for a valid jump for player 2', () => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.board = [{ x: 4, y: 3, player: 'P2', king: false }, { x: 3, y: 4, player: 'P1', king: false }];
      expect(g.isJumpValid('P2', { x: 4, y: 3 }, { x: 2, y: 5 })).to.be.ok;
    });
  });
  describe('#isJumpValid', () => {
    it('should return true for a valid jump for player 1', () => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.board = [{ x: 4, y: 3, player: 'P2', king: false }, { x: 3, y: 4, player: 'P1', king: false }];
      expect(g.isJumpValid('P1', { x: 3, y: 4 }, { x: 5, y: 2 })).to.be.ok;
    });
  });
  describe('#isJumpValid', () => {
    it('should return false for an invalid jump - jumping your own piece', () => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.board = [{ x: 4, y: 3, player: 'P1', king: false }, { x: 3, y: 4, player: 'P1', king: false }];
      expect(g.isJumpValid('P1', { x: 3, y: 4 }, { x: 5, y: 2 })).to.be.false;
    });
  });
  describe('#isJumpValid', () => {
    it('should return false for an invalid jump - jumping too far', () => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.board = [{ x: 4, y: 3, player: 'P1', king: false }, { x: 3, y: 4, player: 'P1', king: false }];
      expect(g.isJumpValid('P1', { x: 3, y: 4 }, { x: 6, y: 1 })).to.be.false;
    });
  });
  describe('#isJumpValid', () => {
    it('should return false for an invalid jump - destination space occupied', () => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.board = [{ x: 4, y: 3, player: 'P2', king: false }, { x: 3, y: 4, player: 'P1', king: false }, { x: 2, y: 5, player: 'P1', king: false }];
      expect(g.isJumpValid('P2', { x: 4, y: 3 }, { x: 2, y: 5 })).to.be.false;
    });
  });
  describe('#jump', () => {
    it.skip('should make a valid jump ', (done) => {
      const g = new Game({ player1: '01234567890123456789abce', player2: '01234567890123456789abcf' });
      g.board = [{ x: 4, y: 3, player: 'P2', king: false }, { x: 3, y: 4, player: 'P1', king: false }];
      g.jump({ player: 'P2', orig: { x: 4, y: 3 }, dest: { x: 2, y: 5 } }, (err1, game) => {
        game.validate(err => {
          expect(err1).to.be.null;
          expect(game.board.filter((space) => space.x === 2 && space.y === 2 && space.player === 'P2' && space.king === false)).to.have.length(1);
          expect(game.board.filter((space) => space.player === 'P1')).to.have.length(0);
          expect(game.board).to.have.length(1);
          done();
        });
      });
    });
  });
});
