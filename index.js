const WebSocket = require('ws');
const port = process.env.PORT || 10000;
const wss = new WebSocket.Server({ port });
const rooms = {};

console.log("Server jalan di port " + port);

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const room = url.searchParams.get('room') || 'global';
  if (!rooms[room]) rooms[room] = [];
  rooms[room].push(ws);
  console.log(`Masuk room ${room} - total ${rooms[room].length}`);

  ws.on('message', (msg) => {
    const text = msg.toString();
    rooms[room].forEach(client => {
      if (client.readyState === 1) client.send(text);
    });
  });

  ws.on('close', () => {
    rooms[room] = rooms[room].filter(c => c!== ws);
  });
});
