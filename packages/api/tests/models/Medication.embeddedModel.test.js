const mongoose = require('mongoose');
const medicationSchema = require('../../models/Medication.embeddedModel');

const Medication = mongoose.model('Medication', medicationSchema);

describe('Medication Schema', () => {
  describe('*** Validation ***', () => {
    it('should require name', (done) => {
      const medication = new Medication();

      medication.validate((err) => {
        expect(err.errors).toHaveProperty('name');
        done();
      });
    });
  });
});
