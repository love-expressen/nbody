const p = new SimplePeer({initiator: false});

p.on('signal', function (data) {
  console.log("SIGNAL", data)
  if (data.type === "answer") {
    //Send answer to server
    //TODO: answer to room by id!
    fetch("/answer", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      },
    });
  }
});

p.on('connect', function () {
  console.log('CONNECT')
  p.send('whatever' + Math.random())
});

p.on('data', function (data) {
  console.log('data: ' + data)
});

p.on('error', function (err) {
  console.log('error', err)
})


function setOffer() {
  fetch("/room")
    .then((response) => response.json())
    .then((json) => {
      console.log("json", json);
      p.signal(
        json
      );
    });

}

setOffer();

