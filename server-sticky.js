/**
 * Server with sticky cluster up to 10x faster than sticky-session
 * 
 * @author skh
 */
const express = require('express');
const num_processes = require('os').cpus().length;
const port = process.env.PORT || 8080;

const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisOptions = require('./src/config/redis');
const cookieParser = require('cookie-parser');


// initialization function
function init(callback) {
  const app = express();
  const server = require('http').Server(app);
  const path = require('path');
  const io = require('socket.io')(server, {
    pingInterval: 5000,
    pingTimeout: 10000,
    transports: ['websocket'],
  });

  app.use(cookieParser('peace'));
  app.use(session({ 
    store: new RedisStore(redisOptions),
    secret: 'peace',
    key: 'jsessionid',
    resave: false,
    saveUninitialized: true,
  }));
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/', (req, res) => {
    res.sendFile(__dirname, "build", 'index.html');
  });

  // Socket events
  require('./src/io-handler/manager')(io);

  callback(server);
}


require('sticky-cluster')(init,
  // options
  {
    concurrency: num_processes,
    port: port,
    debug: (process.env.NODE_ENV === 'development')
  }
)