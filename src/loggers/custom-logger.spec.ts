import { CustomLogger } from './custom-logger';
import { PinoLogger } from 'nestjs-pino';

describe('CustomLogger', () => {
  let customLogger: CustomLogger;
  let mockPinoLogger: Partial<PinoLogger>;

  beforeEach(() => {
    mockPinoLogger = {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    customLogger = new CustomLogger(mockPinoLogger as PinoLogger);
  });

  it('should call trace when verbose is used', () => {
    customLogger.verbose('Test message', 'TestContext');
    expect(mockPinoLogger.trace).toHaveBeenCalledWith({ context: 'TestContext' }, 'Test message');
  });

  it('should call debug when debug is used', () => {
    customLogger.debug('Debug message', 'DebugContext');
    expect(mockPinoLogger.debug).toHaveBeenCalledWith({ context: 'DebugContext' }, 'Debug message');
  });

  it('should call info when log is used', () => {
    customLogger.log('Info message', 'InfoContext');
    expect(mockPinoLogger.info).toHaveBeenCalledWith({ context: 'InfoContext' }, 'Info message');
  });

  it('should call warn when warn is used', () => {
    customLogger.warn('Warning message', 'WarnContext');
    expect(mockPinoLogger.warn).toHaveBeenCalledWith({ context: 'WarnContext' }, 'Warning message');
  });

  it('should call error when error is used', () => {
    customLogger.error('Error message', 'TraceStack', 'ErrorContext');
    expect(mockPinoLogger.error).toHaveBeenCalledWith(
      { context: 'ErrorContext', trace: 'TraceStack' },
      'Error message',
    );
  });
});
