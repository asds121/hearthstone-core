import winston from 'winston';

/**
 * 日志配置
 */
const logConfiguration = {
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ level, message, timestamp, ...metadata }) => {
          let msg = `${timestamp} [${level}]: ${message}`;
          if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
          }
          return msg;
        })
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
};

/**
 * 日志管理器
 */
export class Logger {
  private static instance: winston.Logger;

  /**
   * 获取日志实例
   */
  static getInstance(): winston.Logger {
    if (!Logger.instance) {
      Logger.instance = winston.createLogger(logConfiguration);
    }
    return Logger.instance;
  }

  /**
   * 记录信息日志
   */
  static info(message: string, ...meta: any[]): void {
    Logger.getInstance().info(message, ...meta);
  }

  /**
   * 记录警告日志
   */
  static warn(message: string, ...meta: any[]): void {
    Logger.getInstance().warn(message, ...meta);
  }

  /**
   * 记录错误日志
   */
  static error(message: string, ...meta: any[]): void {
    Logger.getInstance().error(message, ...meta);
  }

  /**
   * 记录调试日志
   */
  static debug(message: string, ...meta: any[]): void {
    Logger.getInstance().debug(message, ...meta);
  }

  /**
   * 记录详细日志
   */
  static verbose(message: string, ...meta: any[]): void {
    Logger.getInstance().verbose(message, ...meta);
  }

  /**
   * 记录 silly 级别日志
   */
  static silly(message: string, ...meta: any[]): void {
    Logger.getInstance().silly(message, ...meta);
  }

  /**
   * 创建子日志器
   */
  static createChildLogger(defaultMeta: Record<string, any>): winston.Logger {
    return Logger.getInstance().child(defaultMeta);
  }
}

// 导出默认实例
export default Logger;