import { Logtail as BetterStackLogger } from "@logtail/node";

type LogLevel = "info" | "error";

class Logger {
  private static instance: Logger;
  private readonly logtail?: BetterStackLogger;

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

  private log<T extends Record<string, unknown>>(level: LogLevel, message: string, meta?: T) {
    if (this.logtail) {
      this.logtail[level](message, meta);
    } else {
      console[level === "error" ? "error" : "log"](message, meta);
    }
  }

  error<T extends Record<string, unknown>>(message: string, meta?: T) {
    this.log("error", message, meta);
  }

  info<T extends Record<string, unknown>>(message: string, meta?: T) {
    this.log("info", message, meta);
  }
}

export const logger = Logger.getInstance();
