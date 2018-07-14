import SimplePeer from "simple-peer";
export default class Network {

  constructor() {
    this.p = new SimplePeer({
      initiator: false,
      objectMode: true
    });

    this.p.on('signal', (data) => {
      if (data.type === "answer") {
        fetch(`/answer/${this.roomId}/${this.playerId}`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          },
        });
      }
    });

    this.p.on('connect', () => {
      console.log("Connected");
      this.cancelReloginTimer();
    });

    this.p.on('data', (data) => {
      //console.log('data: ' + data)
      this.onData && this.onData(JSON.parse(data));
    });

    this.p.on('error', (err) => {
      console.log('error', err);
      this.onError && this.onError(err);
    });
  }

  send(data) {
    this.p.send(JSON.stringify(data));
  }

  getPeer() {
    return this.peer;
  }

  reloginIfFails(room) {
    this.reloginTimer = setTimeout(
      () => {
        console.log("Failed to connect, retrying...");
        this.login(room);
      },
      500);
  }

  cancelReloginTimer() {
    clearTimeout(this.reloginTimer);
  }

  login(room) {
    return fetch("/room/" + room)
    .then((response) => response.json())
    .then((json) => {
      this.roomId = json.roomId;
      this.playerId = json.playerId;
      this.reloginIfFails(room);
      //After this calls we should have a connection to the server
      this.p.signal(json.data);
    });
  }
};



