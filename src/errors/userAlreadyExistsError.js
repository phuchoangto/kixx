class UserAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserAlreadyExists';
  }
}

module.exports = UserAlreadyExistsError;
