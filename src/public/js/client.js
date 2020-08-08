const signalhub = require('signalhub');
const createSwarm = require('webrtc-swarm');
const Player = require('./Player');



const players ={};

navigator.mediaDevices.getUserMedia({'video':true,'audio':true}).then((stream) => {
  const hub = signalhub('lakshya-app' ,['http://localhost:8080']);
  const swarm = createSwarm(hub ,{
    stream:stream
  })
  const you = new Player();
  you.addStream(stream);
  swarm.on('connect',(peer,id) => {
    if(!players[id]) {
      players[id] = new Player();
      peer.on('data' ,(data) => {
        data = JSON.parse(data.toString());
        players[id].update(data);
      })
      players[id].addStream(peer.stream);
    }
    console.log("New member connected: ", id);
  })
  swarm.on('disconnect',(peer,id) =>{ 
    if (players[id]) {
      players[id].element.parentNode.removeChild(players[id].element)
      delete players[id]
    }
  })
  setInterval(() => {
    you.update()
    const youString = JSON.stringify(you)
    swarm.peers.forEach((peer)=> {
      peer.send(youString)
    })
  }, 100)
})

