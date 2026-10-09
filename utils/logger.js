const fs = require('fs');

function log(event, data) {
  const line = `${new Date().toISOString()} ${event} ${JSON.stringify(data)}\n`;
  fs.appendFileSync('./app.log', line);
  console.log(line);
}

module.exports = { log };
