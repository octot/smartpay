const fs = require('fs');

function logToFile(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    // Append the log message to a file
    fs.appendFile('logfile.txt', logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

module.exports = logToFile;
