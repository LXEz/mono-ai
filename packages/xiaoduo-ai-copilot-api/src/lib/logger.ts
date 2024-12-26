import pino from 'pino';
import pretty from 'pino-pretty';
import { Writable, WritableOptions } from 'stream';

export const logger = pino(
  {
    level: 'info',
  },
  pretty({
    colorize: true,
  }),
);

class WritableStream extends Writable {
  private data: unknown[];

  constructor(data: unknown[], options: WritableOptions) {
    super({ ...options, objectMode: false });
    this.data = data;
  }

  _write(chunk: unknown, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    try {
      this.data.push(chunk);
      callback();
    } catch (error) {
      callback(error as Error);
    }
  }

  getData(): unknown[] {
    return this.data;
  }
}

export class ContextLogger {
  private logStream: WritableStream;
  private logger: pino.Logger;

  constructor(data: unknown[] = [], options: WritableOptions = {}) {
    this.logStream = new WritableStream(data, options);
    this.logger = pino({ level: 'info' }, this.logStream);
  }

  getLogData(): unknown[] {
    return this.logStream.getData();
  }

  info(obj: object, msg?: string, ...args: unknown[]): void {
    this.logger.info(obj, msg, ...args);
  }

  warn(obj: object, msg?: string, ...args: unknown[]): void {
    this.logger.warn(obj, msg, ...args);
  }

  error(obj: object, msg?: string, ...args: unknown[]): void {
    this.logger.error(obj, msg, ...args);
  }
}
