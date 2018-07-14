const Room = require("../Room");
const uuid = require("uuid");

const __rooms = {};

module.exports = function(app) {

  /// ADD PLAYER TO ROOM AND SEND OFFER
  app.get("/room/?:id?", (req, res) => {
    const roomId = req.params.id || uuid.v4();
    const playerId = uuid.v4();
    if (!__rooms[roomId]) {
      __rooms[roomId] = new Room(roomId);
    }
    const room = __rooms[roomId];
    room.addPlayer(playerId, res);
  });

  /// HANDLE PLAYER ANSWER (actual game start)
  app.post("/answer/:roomId/:playerId", (req, res) => {
    const room = __rooms[req.params.roomId];
    room.onPlayerAnswer(req.params.playerId, req.body);
    res.status(200).send();
  });

};