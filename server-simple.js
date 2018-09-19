const port = process.env.PORT || 8080

const express = require('express')
const app = express()
const path = require('path')
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  pingInterval: 5000,
  pingTimeout: 10000,
})
app.use(express.static(path.join(__dirname, 'build')))


// Socket events
require('./src/io-handler/manager')(io)  

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public")
})


server.listen(port, () => {
  console.log("Live on", port)
})