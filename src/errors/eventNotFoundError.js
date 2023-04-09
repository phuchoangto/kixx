class EventNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EventNotFoundError';
  }
}

module.exports = EventNotFoundError;
