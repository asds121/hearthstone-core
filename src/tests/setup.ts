// 测试环境设置
import { Logger } from '../utils/Logger';

// 在测试环境中禁用日志输出
Logger.getInstance().transports.forEach((transport: any) => {
  if (transport.silent !== undefined) {
    transport.silent = true;
  }
});

// 全局测试配置
global.console = {
  ...console,
  // 在测试中抑制console.log输出
  log: jest.fn(),
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};

// 测试超时设置
jest.setTimeout(10000);
