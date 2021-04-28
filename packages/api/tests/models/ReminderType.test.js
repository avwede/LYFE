const ReminderType = require('../../models/ReminderType');

describe('ReminderType Schema', () => {
  describe('*** Validation ***', () => {
    it('should require type, user', (done) => {
      const reminderType = new ReminderType();

      reminderType.validate((err) => {
        expect(err.errors).toHaveProperty('type');
        expect(err.errors).toHaveProperty('user');
        done();
      });
    });
  });
});