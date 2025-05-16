import { createLogger, format, transports } from "winston";

export { format } from "winston";

const SERVICE_NAME =
  process.env.FUNCTION_TARGET ||
  process.env.K_SERVICE ||
  process.env.FUNCTION_NAME ||
  process.cwd().split("/").pop();

const addSeverity = format((info) => {
  info.severity = info.level;

  return info;
});

//if you pass an object as message, it will be assigned to data
const stringifyObjMessage = format((info) => {
  if (info.message && info instanceof Error) {
    return info;
  }
  if (info.message && typeof info.message === "object") {
    info.data = info.message;
    info.message = JSON.stringify(info.message);
  }
  return info;
});

//adds data passed in to logger, as data property
const handleData = format((info) => {
  const data = info.data;
  let message = "";
  let finalData;
  if (data && Array.isArray(data) && data.length) {
    for (const element of data) {
      if (typeof element === "string") {
        if (message.length > 0) {
          message += " " + element;
        } else {
          message = element;
        }
      } else {
        if (element instanceof Error) {
          if (message.length > 0) {
            message += " " + element.message;
          } else {
            message = element.message;
          }
          finalData = element.stack;
        } else {
          finalData = element;
        }
      }
    }
  } else {
    message = info.message as string;
  }

  info.message = message;
  info.data = finalData;
  return info;
});

//local transport only
const stripMeta = format((info) => {
  delete info.meta;
  return info;
});

const stripLevel = format((info) => {
  //@ts-expect-error - level cannot be deleted, but we want to remove it
  delete info.level;
  return info;
});

const localConsoleTransport = () =>
  new transports.Console({
    format: format.combine(stripMeta(), handleData(), format.prettyPrint()),
  });

const gcpConsoleTransport = () =>
  new transports.Console({
    format: format.combine(
      addSeverity(),
      handleData(),
      stripLevel(),
      format.json(),
    ),
  });

const loggerConfig = () => ({
  level: "debug",

  format: format.combine(
    stringifyObjMessage(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports:
    process.env.NODE_ENV === "production"
      ? [gcpConsoleTransport()]
      : [localConsoleTransport()],
});

type Meta = Record<string, any> | undefined;
export default class Logger {
  private logger: ReturnType<typeof createLogger>;
  private defaultMeta: Meta = {
    service: SERVICE_NAME,
  };
  private constructMeta: Meta = {};
  private additionalMeta: Meta = {};

  constructor(meta?: Meta) {
    if (meta) {
      this.constructMeta = meta;
    }
    this.logger = createLogger(loggerConfig()).child({
      meta: {
        ...this.defaultMeta,
        ...this.constructMeta,
      },
    });
  }

  addMeta(meta: Meta) {
    this.additionalMeta = { ...this.additionalMeta, ...meta };
    this.logger = this.logger.child({
      meta: {
        ...this.defaultMeta,
        ...this.constructMeta,
        ...this.additionalMeta,
      },
    });
  }

  removeMeta(key: string) {
    const newMeta = {
      ...this.defaultMeta,
      ...this.constructMeta,
      ...this.additionalMeta,
    };

    delete newMeta[key];

    this.logger = this.logger.child({
      meta: newMeta,
    });
  }

  info(...args: any[]) {
    this.logger.info.call(this.logger, args);
  }

  infoWithSlackNotification(...args: any[]) {
    const childLogger = this.logger.child({ notificationType: "info" });
    childLogger.info.call(childLogger, args);
  }

  warn(...args: any[]) {
    this.logger.warn.call(this.logger, args);
  }

  warnWithSlackNotification(...args: any[]) {
    const childLogger = this.logger.child({ notificationType: "warn" });
    childLogger.warn.call(childLogger, args);
  }

  error(...args: any[]) {
    this.logger.error.call(this.logger, args);
  }

  errorWithSlackNotification(...args: any[]) {
    const childLogger = this.logger.child({ notificationType: "error" });
    childLogger.error.call(childLogger, args);
  }

  debug(...args: any[]) {
    this.logger.debug.call(this.logger, args);
  }

  debugWithSlackNotification(...args: any[]) {
    const childLogger = this.logger.child({ notificationType: "debug" });
    childLogger.debug.call(childLogger, args);
  }
}
