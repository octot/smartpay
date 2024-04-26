const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'logs.txt');
const logger = {
  log: (...args) => {
    const message = args.join(' ');
    const timestamp = new Date().toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/\//g, '/');
    fs.appendFile(logFilePath, `[${timestamp}] ${message}\n`, (err) => {
      if (err) {
        console.error('Failed to write log:', err);
      }
    });
    console.log(...args);
  },
  error: (...args) => {
    const message = args.join(' ');
    const timestamp = new Date().toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/\//g, '/');
    fs.appendFile(logFilePath, `[${timestamp}] [ERROR] ${message}\n`, (err) => {
      if (err) {
        console.error('Failed to write error:', err);
      }
    });
    console.error(...args);
  },
};

module.exports = logger;