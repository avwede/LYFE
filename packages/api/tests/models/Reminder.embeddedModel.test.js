const mongoose = require('mongoose');
const reminderSchema = require('../../models/Reminder.embeddedModel');

const Reminder = mongoose.model('Reminder', reminderSchema);

describe('Reminder Schema', () => {
  describe('*** Validation ***', () => {
    it('should require name, startDate', (done) => {
      const reminder = new Reminder();

      reminder.validate((err) => {
        expect(err.errors).toHaveProperty('name');
        expect(err.errors).toHaveProperty('startDate');
        done();
      });
    });
  });
});
