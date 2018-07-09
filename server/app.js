var Peer = require("simple-peer");
var wrtc = require("wrtc");
var express = require("express");
var path = require("path");
const bodyParser = require("body-parser");

let p;

const app = express();
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "../client")));

app.post("/answer", (req, res) => {
  p.signal(req.body);
  res.status(200).send();
});

app.get("/room", (req, res) => {
  p = new Peer({initiator: true, trickle: true, wrtc});
  p.on('error', function (err) {
    console.error('error', err)
  });
  p.on('signal', function (data) {
    //console.log('SIGNAL', JSON.stringify(data));
    if(data.type === "offer") {
      res.json(data);
    }
  });
  p.on('connect', function () {
    console.log("Connected!");

    //TODO: serialize? Can we send arrays?
    TEST THIS!
    const arr = new Uint8Array(100);
    p.send(arr)
  });

});

const server= app.listen(3001, ()=>{
  console.log("Server running on port",server.address().port)
});
