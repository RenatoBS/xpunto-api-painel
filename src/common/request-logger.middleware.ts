import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger: Logger = new Logger('NestApplication');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, baseUrl } = req;

    setImmediate(async () => {
      const requestLog = {
        method,
        path: baseUrl,
      };
      this.logger.verbose(`Request: ${JSON.stringify(requestLog)}`);
    });

    let body = {};
    const chunks = [];
    const oldEnd = res.end;
    res.end = (chunk) => {
      if (chunk) {
        chunks.push(Buffer.from(chunk));
      }
      body = Buffer.concat(chunks).toString('utf8');
      return oldEnd.call(res, body);
    };

    res.on('finish', async () => {
      return setTimeout(() => {
        const responseLog = {
          method,
          path: baseUrl,
          statusCode: res.statusCode,
        };
        this.logger.verbose(`Response: ${JSON.stringify(responseLog)}`);
      }, 0);
    });

    next();
  }
}
