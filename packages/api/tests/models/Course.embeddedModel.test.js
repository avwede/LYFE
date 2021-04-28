const mongoose = require('mongoose');
const courseSchema = require('../../models/Course.embeddedModel');

const Course = mongoose.model('Course', courseSchema);

describe('Course Schema', () => {
  describe('*** Validation ***', () => {
    it('should require courseCode, professor, location, day', (done) => {
      const course = new Course();

      course.validate((err) => {
        expect(err.errors).toHaveProperty('courseCode');
        expect(err.errors).toHaveProperty('professor');
        expect(err.errors).toHaveProperty('location');
        done();
      });
    });
  });
});