const WebSocket = require("ws");
const http = require("http");
const { v4: uuidv4 } = require("uuid");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Map();

function broadcast(message, excludeClient = null) {
  clients.forEach((client, id) => {
    if (client.readyState === WebSocket.OPEN && client !== excludeClient) {
      client.send(message);
    }
  });
}

wss.on("connection", (ws) => {
  const clientId = uuidv4();
  clients.set(clientId, ws);
  console.log("Client connected:", clientId, "Total clients:", clients.size);

  const welcomeMessage = `Welcome! You are client ${clientId}.`;
  ws.send(welcomeMessage);

  const newClientMessage = `Client ${clientId} has joined the room.`;
  broadcast(newClientMessage, ws);

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on("close", () => {
    clients.delete(clientId);
    console.log(
      "Client disconnected:",
      clientId,
      "Total clients:",
      clients.size
    );
    const leaveMessage = `Client ${clientId} has left the room.`;
    broadcast(leaveMessage);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
