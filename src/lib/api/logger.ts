import { Logtail as BetterStackLogger } from "@logtail/node";

class Logger {
  private static instance: Logger;
  private logtail?: BetterStackLogger;

  private constructor() {
    const token = process.env.BETTER_STACK_SOURCE_TOKEN;
    const endpoint = process.env.BETTER_STACK_INGESTING_URL;
    if (token && endpoint) {
      this.logtail = new BetterStackLogger(token, { endpoint });
    }
  }

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string, meta?: any) {
    if (this.logtail) {
      this.logtail.info(message, meta);
    } else {
      console.log(message, meta);
    }
  }

  error(message: string, meta?: any) {
    if (this.logtail) {
      this.logtail.error(message, meta);
    } else {
      console.error(message, meta);
    }
  }

  async flush() {
    if (this.logtail) {
      await this.logtail.flush();
    }
  }
}

export const logger = Logger.getInstance();
