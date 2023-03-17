export default class Client {
  constructor() {
    this.ws = new WebSocket("ws://localhost:3000");
    this.ws.addEventListener("open", this.onOpen.bind(this));
    this.ws.addEventListener("message", this.onMessage.bind(this));
    this.ws.addEventListener("close", this.onClose.bind(this));
    this.ws.addEventListener("error", this.onError.bind(this));
  }

  onOpen(event) {
    console.log("Connected to WebSocket server:", event);
  }
  onMessage(event) {
    console.log("Received message:", event.data);
  }
  onClose(event) {
    console.log("Disconnected from WebSocket server:", event);
  }
  onError(error) {
    console.error("WebSocket error:", event);
  }
}
