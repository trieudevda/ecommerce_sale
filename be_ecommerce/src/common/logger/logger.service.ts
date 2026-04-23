import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class CustomLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/app.log',
        }),
      ],
    });
  }

  log(message: string, context?: string, meta?: any) {
    this.logger.info({ message, context, meta });
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error({ message, context, trace, meta });
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn({ message, context, meta });
  }

  debug(message: string, context?: string, meta?: any) {
    this.logger.debug({ message, context, meta });
  }
}
