module.exports = function(app) {
    var express = require('express'),
        http = require('http'),
        path = require('path'),
        app = express(),
        server = http.createServer(app),
        io = require('socket.io').listen(server),
        testServerRouter = express.Router();

      // socket io stuff
      io.sockets.on("connection", function(socket) {
          console.log("User Connected");

          io.sockets.emit("message", {
              message: "New connection"
          });

          socket.on("send", function(data) {
              io.sockets.emit("message", {
                  message: data.message
              });
          });
      });

    testServerRouter.get('/', function(req, res) {
        res.send({
            'test-server': []
        });
    });

    testServerRouter.post('/user', function(req, res) {
        res.status(201).end();
    });

    testServerRouter.get('/:id', function(req, res) {
        res.send({
            'test-server': {
                id: req.params.id
            }
        });
    });

    testServerRouter.put('/:id', function(req, res) {
        res.send({
            'test-server': {
                id: req.params.id
            }
        });
    });

    testServerRouter.delete('/:id', function(req, res) {
        res.status(204).end();
    });

    app.use('/api/test-server', testServerRouter);
};