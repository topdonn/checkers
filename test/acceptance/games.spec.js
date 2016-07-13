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
  describe('post /games', () => {
    it('should create a new game via POST', (done) => {
      request(app)
      .post('/games')
      .send({ player1: '01234567890123456789abcd', player2: '01234567890123456789abce' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game.board[0]).to.deep.equal(["X","","X","","X","","X",""]);
        expect(rsp.body.game.board[1]).to.deep.equal(["","X","","X","","X","","X"]);
        expect(rsp.body.game.board[2]).to.deep.equal(["X","","X","","X","","X",""]);
        expect(rsp.body.game.board[3]).to.deep.equal(["","","","","","","",""]);
        expect(rsp.body.game.board[4]).to.deep.equal(["","","","","","","",""]);
        expect(rsp.body.game.board[5]).to.deep.equal(["O","","O","","O","","O",""]);
        expect(rsp.body.game.board[6]).to.deep.equal(["","O","","O","","O","","O"]);
        expect(rsp.body.game.board[7]).to.deep.equal(["O","","O","","O","","O",""]);
        done();
      });
    });
  });
  describe('post /games', () => {
    it('should get a new game via GET', (done) => {
      request(app)
      .get('/games/01234567890123456789abca')
      .end((err2, rsp2) => {
        console.log(rsp2.body)
        expect(err2).to.be.null;
        expect(rsp2.status).to.equal(200);
        expect(rsp2.body.game.board[0]).to.deep.equal(["X","","X","","X","","X",""]);
        expect(rsp2.body.game.board[1]).to.deep.equal(["","X","","X","","X","","X"]);
        expect(rsp2.body.game.board[2]).to.deep.equal(["X","","X","","X","","X",""]);
        expect(rsp2.body.game.board[3]).to.deep.equal(["","","","","","","",""]);
        expect(rsp2.body.game.board[4]).to.deep.equal(["","","","","","","",""]);
        expect(rsp2.body.game.board[5]).to.deep.equal(["O","","O","","O","","O",""]);
        expect(rsp2.body.game.board[6]).to.deep.equal(["","O","","O","","O","","O"]);
        expect(rsp2.body.game.board[7]).to.deep.equal(["O","","O","","O","","O",""]);
        done();
      });
    });
  });
});
