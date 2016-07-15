/* eslint-disable no-unused-expressions, no-unused-vars, comma-spacing, no-underscore-dangle, quotes, max-len */
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');

describe('games', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populateTestDB.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });
  describe('post /games', () => {
    it('should create a new game via POST', (done) => {
      request(app)
      .post('/games')
      .send({ player1: '01234567890123456789abcd', player2: '01234567890123456789abce' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game.board).to.have.length(24);
        done();
      });
    });
  });
  describe('get /games/:id', () => {
    it('should get a new game via GET', (done) => {
      request(app)
      .get('/games/01234567890123456789abca')
      .end((err2, rsp2) => {
        expect(err2).to.be.null;
        expect(rsp2.status).to.equal(200);
        expect(rsp2.body.game.board).to.have.length(3);
        expect(rsp2.body.game.board.filter(space => space.x === 1)).to.have.length(1);
        done();
      });
    });
  });
  describe('put /games/:id/move', () => {
    it('player should be able to make a move', (done) => {
      request(app)
      .put('/games/01234567890123456789abca/move')
      .send({ player: 'P1', orig: { x: 4, y: 4 }, dest: { x: 3, y: 3 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game.board.filter(space => space.x === 3 && space.y === 3 && space.player === 'P1')).to.have.length(1);
        expect(rsp.body.game.board.filter(space => space.x === 4 && space.y === 4)).to.have.length(0);
        // expect(rsp.body.updatedBoard.filter((space) => space.x === 1 && space.y === 4 && space.player === 'P2' && space.king === false)).to.have.length(1));
        done();
      });
    });
  });
  describe('put /games/:id/jump', () => {
    it('player 2 should be able to jump from 2,2 to 2,4', (done) => {
      request(app)
      .put('/games/01234567890123456789abcc/jump')
      .send({ player: 'P2', orig: { x: 2, y: 2 }, dest: { x: 4, y: 4 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game.board.filter(space => space.x === 2 && space.y === 2 )).to.have.length(0);
        expect(rsp.body.game.board.filter(space => space.x === 4 && space.y === 4)).to.have.length(1);
        expect(rsp.body.game.board.filter(space => space.x === 3 && space.y === 3)).to.have.length(0);
        // expect(rsp.body.game.board).to.have.length(2);
        // expect(rsp.body.updatedBoard.filter((space) => space.x === 1 && space.y === 4 && space.player === 'P2' && space.king === false)).to.have.length(1));
        done();
      });
    });
  });
  describe('put /games/:id/jump', () => {
    it('as a king, player 1 should be able to jump from 3,3 to 1,5', (done) => {
      request(app)
      .put('/games/01234567890123456789abcc/jump')
      .send({ player: 'P1', orig: { x: 3, y: 3 }, dest: { x: 1, y: 5 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game.board.filter(space => space.x === 3 && space.y === 3 )).to.have.length(0);
        expect(rsp.body.game.board.filter(space => space.x === 1 && space.y === 5)).to.have.length(1);
        expect(rsp.body.game.board.filter(space => space.x === 2 && space.y === 4)).to.have.length(0);
        expect(rsp.body.game.board).to.have.length(2);
        // expect(rsp.body.updatedBoard.filter((space) => space.x === 1 && space.y === 4 && space.player === 'P2' && space.king === false)).to.have.length(1));
        done();
      });
    });
  });
  describe('put /games/:id/jump', () => {
    it('player 2 should NOT be able to jump from 2,4 to 4,2', (done) => {
      request(app)
      .put('/games/01234567890123456789abcc/jump')
      .send({ player: 'P2', orig: { x: 2, y: 4 }, dest: { x: 4, y: 2 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game.board.filter(space => space.x === 2 && space.y === 4 )).to.have.length(1);
        expect(rsp.body.game.board.filter(space => space.x === 4 && space.y === 2)).to.have.length(0);
        expect(rsp.body.game.board.filter(space => space.x === 3 && space.y === 3)).to.have.length(1);
        expect(rsp.body.game.board).to.have.length(3);
        // expect(rsp.body.updatedBoard.filter((space) => space.x === 1 && space.y === 4 && space.player === 'P2' && space.king === false)).to.have.length(1));
        done();
      });
    });
  });
});
