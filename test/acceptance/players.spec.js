/* eslint-disable no-unused-expressions, no-unused-vars, no-underscore-dangle, max-len */
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');

describe('players', () => {
  describe('post /players', () => {
    it('should create a new player', (done) => {
      request(app)
      .post('/players')
      .send({ name: 'P1' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.player.name).to.equal('P1');
        expect(rsp.body.player.wins).to.equal(0);
        expect(rsp.body.player.losses).to.equal(0);
        expect(rsp.body.player._id).to.be.ok;
        done();
      });
    });
  });
});
