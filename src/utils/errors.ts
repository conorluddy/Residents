class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

class EmailError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "EmailError"
  }
}

class PasswordError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PasswordError"
  }
}

export { ValidationError, EmailError, PasswordError }
