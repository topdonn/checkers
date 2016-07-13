/* eslint-disable no-unused-expressions, no-unused-vars, func-names, prefer-arrow-callback, max-len */
const expect = require('chai').expect;
const sinon = require('sinon');
const Player = require('../../dst/models/player');

describe('Player', () => {
  describe('constructor', () => {
    it('should create a new player', (done) => {
      const p = new Player({ name: 'P1' });
      p.validate(err => {
        expect(err).to.be.undefined;
        expect(p.name).to.equal('P1');
        expect(p.wins).to.equal(0);
        expect(p.losses).to.equal(0);
        done();
      });
    });
  });
});
