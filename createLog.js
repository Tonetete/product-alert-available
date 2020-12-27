const winston = require("winston");

const getTransports = (level) => ({
  console: new winston.transports.Console({ level }),
  file: new winston.transports.File({
    filename: "error.log",
    level,
  }),
});

const createLog = (msg, level) => {
  const transports = getTransports(level);
  const logger = winston.createLogger({
    transports: [transports.console, transports.file],
  });
  if (level === "error") {
    logger.error(msg);
  }
};

module.exports = {
  createLog,
};
