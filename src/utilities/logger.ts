/** @format */

import winston from "winston";

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
});


const logger = winston.createLogger({

        level: process.env.LOG_LEVEL || "info",

        format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.align(),
                logFormat,
        ),

        transports: [
                new winston.transports.Console({
                        format: winston.format.simple(), 
                }),
        ],
});

export default logger;
