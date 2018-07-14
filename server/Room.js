const Peer = require("simple-peer");
const WRTC = require("wrtc");

const GameServer = require("./GameServer");

const PEER_CONF = {
  config: {
    iceServers: [
      {urls: 'stun:stun.l.google.com:19302'}
    ],
    objectMode: true
  },
  initiator: true,
  trickle: true,
  wrtc: WRTC
};

module.exports = class Room {
  constructor(roomId) {
    this.id = roomId;
    this.players = {};
    this.createGameServer();
  }

  createGameServer() {
    this.gameServer = new GameServer(
      this.onGameStateChange.bind(this),
      this.onGameEnd.bind(this)
    );
  }

  getPlayer(playerId) {
    return this.players[playerId];
  }

  addPlayer(playerId, res) {
    const peer = new Peer(PEER_CONF);
    peer.on("error", this.onPeerError.bind(this, playerId));
    peer.on("signal", this.onPeerSignal.bind(this, playerId));
    peer.on("data", this.onPeerData.bind(this, playerId));
    peer.on("connect", this.onPeerConnect.bind(this, playerId));

    this.players[playerId] = {
      ready: false,
      onOffer: (data) => {
        res.json({
          data,
          roomId: this.id,
          playerId
        });
      },
      peer
    };
  }

  onGameStateChange(state) {
    const jsonState = JSON.stringify(state);
    Object.values(this.players)
    .filter(p => p.ready)
    .forEach(p => p.peer.send(jsonState));
  }

  onGameEnd() {
    console.log("GAME WITH ID", this.id, "ENDED");
    this.players = {};
    this.createGameServer();
  }

  onPlayerAnswer(playerId, data) {
    this.getPlayer(playerId).peer.signal(data);
  }

  onPeerError(playerId, err) {
    console.error("error", playerId, err)
  }

  onPeerSignal(playerId, data) {
    if (data.type === "offer") {
      this.getPlayer(playerId).onOffer(data);
    }
  }

  onPeerData(playerId, rawData) {
    const data = JSON.parse(rawData);
    this.gameServer.moveHole(playerId, data);
  }

  onPeerConnect(playerId) {
    console.log("Connected room", this.id, "player", playerId);
    this.gameServer.start();
    const player = this.getPlayer(playerId);
    player.ready = true;
  }

}
;
