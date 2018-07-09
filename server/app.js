const Peer = require("simple-peer");
const wrtc = require("wrtc");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const uuid = require("uuid");

const GameServer = require("./GameServer");

const rooms = {};

const app = express();
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "../client")));

app.post("/answer/:roomId/:peerId", (req, res) => {
  console.log("/ANSWER", req.body);
  rooms[req.params.roomId].peers[req.params.peerId].signal(req.body);
  res.status(200).send();
});

app.get("/room/?:id?", (req, res) => {
  console.log("/ROOM", req.params.id);
  const roomId = req.params.id || uuid.v4();
  const peerId = uuid.v4();
  if (!rooms[roomId]) {
    rooms[roomId] = {
      gameServer: new GameServer(),
      peers: {}
    };
  }
  const room = rooms[roomId];
  const p = new Peer({
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ],
      objectMode: true
    },
    initiator: true,
    trickle: true,
    wrtc
  });
  room.peers[peerId] = p;
  p.on('error', function(err) {
    console.error('error', err)
  });
  p.on('signal', function(data) {
    console.log('SIGNAL', JSON.stringify(data));
    if (data.type === "offer") {
      res.json({
        data,
        roomId,
        peerId
      });
    }
  });
  p.on('data', function(rawData) {
    const data = JSON.parse(rawData);
    room.gameServer.moveHole(data);
  });
  p.on('connect', function() {
    console.log("Connected room", roomId, "peer", peerId);
    const state = JSON.stringify(room.gameServer.getState());
    p.send(state);
    let counter = 5000;
    const dt = 1/100;
    const interval = setInterval( () => {
      room.gameServer.step(dt, false);
     try{
       p.send(JSON.stringify(room.gameServer.getState()));
       if(counter--<0){
         clearInterval(interval);
       }
     } catch(e){

     }

    }, dt * 1000);
  });
});

const server = app.listen(3001, () => {
  console.log("Server running on port", server.address().port)
});
