import { createLogger, format, transports } from "winston";

const { combine, colorize, timestamp, printf } = format;

const customFormat = format(info => {
    info.level = info.level.toUpperCase();
    info.pid = process.pid;
    return info;
})

const prettyPrint = printf(({ pid, level, message, timestamp, label }) => {
    return `${timestamp} \x1b[32m${label}\x1b[0m \x1b[33m${pid}\x1b[0m \x1b[34m${level}\x1b[0m \x1b[35m${message}\x1b[0m`;
});

const logger = createLogger({
    level: "debug",
    format: combine(
        customFormat(),
        colorize(),
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        prettyPrint
    ),
    transports: [
        new transports.Console()
    ],
    exitOnError: false
});

export { logger as Logger };