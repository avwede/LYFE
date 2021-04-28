const mongoose = require('mongoose');
const locationSchema = require('../../models/Location.embeddedModel');

const Location = mongoose.model('Location', locationSchema);

describe('Location Schema', () => {
  describe('*** Validation ***', () => {
    it('should require type', (done) => {
      const location = new Location();

      location.validate((err) => {
        expect(err.errors).toHaveProperty('type');
        done();
      });
    });
  });
});