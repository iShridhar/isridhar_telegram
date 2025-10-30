// Simple logger utility
export class Logger {
  static log(emoji, message, ...args) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${emoji} ${message}`, ...args);
  }

  static info(message, ...args) {
    this.log('ℹ️', message, ...args);
  }

  static success(message, ...args) {
    this.log('✅', message, ...args);
  }

  static error(message, ...args) {
    this.log('❌', message, ...args);
  }

  static warn(message, ...args) {
    this.log('⚠️', message, ...args);
  }

  static debug(message, ...args) {
    if (process.env.DEBUG === 'true') {
      this.log('🐛', message, ...args);
    }
  }
}




