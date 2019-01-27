const drone = new Scaledrone('6FH7kYc5EbpaZfGD');

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  drone.publish({
    room: 'my-room',
    message: {message: 'Hello world!', score: 42}
  });
});

const room = drone.subscribe('my-room');
room.on('open', error => {
  if (error) {
    console.error(error);
  } else {
    console.log('Connected to room');
  }
});
room.on('data', data => console.log('Received data:', data));

drone.on('error', error => console.error(error));