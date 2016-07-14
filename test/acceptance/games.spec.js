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
    it('should POST a move by a player', (done) => {
      request(app)
      .put('/games/01234567890123456789abca/move')
      .send({ player: 'P1', orig: { x: 4, y: 4 }, dest: { x: 3, y: 3 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        console.log(rsp.body.game.board);
        expect(rsp.body.game.board.filter(space => space.x === 3 && space.y === 3 && space.player === 'P1')).to.have.length(1);
        expect(rsp.body.game.board.filter(space => space.x === 4 && space.y === 4)).to.have.length(0);
        // expect(rsp.body.updatedBoard.filter((space) => space.x === 1 && space.y === 4 && space.player === 'P2' && space.king === false)).to.have.length(1));
        done();
      });
    });
  });
});
