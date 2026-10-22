type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function maskSensitive(data: any): any {
  if (!data || typeof data !== 'object') return data;
  const masked = { ...data };
  const sensitiveKeys = ['password', 'passwordHash', 'token', 'secret', 'secretKey', 'cvv', 'card'];

  for (const key of Object.keys(masked)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
      masked[key] = '[REDACTED]';
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitive(masked[key]);
    }
  }
  return masked;
}

export const logger = {
  info(message: string, context?: Record<string, any>) {
    console.log(`[INFO]  ${new Date().toISOString()} - ${message}`, context ? maskSensitive(context) : '');
  },
  warn(message: string, context?: Record<string, any>) {
    console.warn(`[WARN]  ${new Date().toISOString()} - ${message}`, context ? maskSensitive(context) : '');
  },
  error(message: string, err?: any, context?: Record<string, any>) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, err?.message || err, context ? maskSensitive(context) : '');
  },
  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, context ? maskSensitive(context) : '');
    }
  },
};
