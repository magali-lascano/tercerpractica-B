import path from "path";
import { fileURLToPath } from "url";import winston from 'winston';
import config from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const pathInfo = path.join(path.dirname(__filename), '../logs/errors.log');

const devLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ]
});

const prodLogger = winston.createLogger({
    filename: pathInfo,
    transports: [
        new winston.transports.Console({ level: 'info' })
    ]
});

const addLogger = (req, res, next) =>{
    req.logger = config.MODE === 'devel' ? devLogger : prodLogger;
    req.logger.http(`${new Date().toDateString()} ${req.method} ${req.url}`);
    next();
}




export default addLogger;