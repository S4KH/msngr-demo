/**
 * @author skh
 */
const port = process.env.PORT || 8080;
const cluster = require('cluster');

if(cluster.isMaster) {
  for(let i = 0; i<4; i++) {
    cluster.fork();
  }

  // Cluster events
  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker ', worker.id, ' died, respawing..');
    cluster.fork();
  })
} else if(cluster.isWorker) {
  const express = require('express');
  const app = express();
  const path = require('path');
  const server = require('http').Server(app);
  const io = require('socket.io')(server, {
    pingInterval: 5000,
    pingTimeout: 10000,
    transports: ['websocket'],
  });
  app.use(express.static(path.join(__dirname, 'build')));
  

  // Socket events
  require('./events')(io, cluster.worker.id);
  
  app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public");
  });

  
  server.listen(port, () => {
    console.log("Live on", port);
  });
}