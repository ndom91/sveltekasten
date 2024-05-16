import winston from "winston"

interface LoggerOptions {
  level?: string
  // level?: winston.LoggerOptions["levels"]
  prefix?: string
}

export const getLogger = ({
  level = "info",
  prefix = "app",
}: LoggerOptions) => {
  return winston.createLogger({
    level,
    transports: [
      new winston.transports.Console({
        level,
        format: winston.format.combine(
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.colorize({ all: true }),
          winston.format.uncolorize({ message: true, level: false }),
          winston.format.printf(
            info =>
              `${info.level} ${info.timestamp} [${prefix.toUpperCase()}]: ${info.message}`,
          ),
        ),
      }),
    ],
  })
}
