/** @format */

import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Custom formatting for logs
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
});

// Create the logger instance
const logger = winston.createLogger({
        // Set the default level. Logs below this level are ignored.
        level: process.env.LOG_LEVEL || "info",

        // Combine various formats for logging
        format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.align(),
                logFormat,
        ),

        // Define transports for logging
        transports: [
                // Console transport for outputting logs to the console
                new winston.transports.Console({
                        format: winston.format.simple(), // Simple format for console logs
                }),

                // Daily rotation file transport for combined logs
                new DailyRotateFile({
                        filename: "logs/application-%DATE%.log",
                        datePattern: "YYYY-MM-DD",
                        zippedArchive: true,
                        maxSize: "20m",
                        maxFiles: "14d",
                }),

                // Daily rotation file transport for error logs
                new DailyRotateFile({
                        filename: "logs/error-%DATE%.log",
                        datePattern: "YYYY-MM-DD",
                        zippedArchive: true,
                        maxSize: "20m",
                        maxFiles: "30d",
                        level: "error",
                }),
        ],
});

export default logger;
