require('dotenv').config();
const http = require('http');
const app = require('./app');

const port = process.env.PORT;
const host = process.env.HOSTNAME;

const server = http.createServer(app);
server.listen(port, host, () => {
  try {
    console.log(`http://${host}:${port}`);
  } catch (err) {
    console.log(err.stack);
  }
});
