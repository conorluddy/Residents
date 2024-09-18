import winston from 'winston'

// Update all this to be env specific

const logger = winston.createLogger({
  level: 'debug', //  "info", // Minimum level to log
  format: winston.format.combine(
    winston.format.prettyPrint(),
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.json()
  ),
  transports: [
    // Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
    // Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
})

// If we're not in production, log to the `console` as well
// if (process.env.NODE_ENV === "production") {
logger.add(
  new winston.transports.Console({
    format: winston.format.prettyPrint(),
  })
)
// }

export { logger }
