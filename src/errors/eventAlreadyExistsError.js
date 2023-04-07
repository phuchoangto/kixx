class EventAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EventAlreadyExists';
  }
}

module.exports = EventAlreadyExistsError;
