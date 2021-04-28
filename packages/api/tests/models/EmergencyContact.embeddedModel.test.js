const mongoose = require('mongoose');
const emergencyContactSchema = require('../../models/EmergencyContact.embeddedModel');

const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);

describe('EmergencyContact Schema', () => {
  describe('*** Validation ***', () => {
    it('should require firstName, lastName, phoneNumber, email, relation', (done) => {
      const emergencyContact = new EmergencyContact();

      emergencyContact.validate((err) => {
        expect(err.errors).toHaveProperty('firstName');
        expect(err.errors).toHaveProperty('lastName');
        expect(err.errors).toHaveProperty('phoneNumber');
        expect(err.errors).toHaveProperty('email');
        expect(err.errors).toHaveProperty('relation');
        done();
      });
    });
  });
});
