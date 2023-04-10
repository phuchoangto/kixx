class FacultyAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FacultyAlreadyExists';
  }
}

module.exports = FacultyAlreadyExistsError;
