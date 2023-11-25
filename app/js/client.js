export default class Client {
  constructor() {
    this.initializeWebSocket();
    this.users = [];
  }

  initializeWebSocket() {
    this.ws = new WebSocket("ws://localhost:3000");
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.ws.addEventListener("open", this.onOpen.bind(this));
    this.ws.addEventListener("message", this.onMessage.bind(this));
    this.ws.addEventListener("close", this.onClose.bind(this));
    this.ws.addEventListener("error", this.onError.bind(this));
  }

  onOpen(event) {
    console.log("Connected to server " + event.srcElement.url);
  }

  onMessage(event) {
    const data = JSON.parse(event.data);
    console.log(data);
  }

  onClose(event) {
    console.log("Connection closed", event);
  }

  onError(event) {
    console.error("WebSocket error", event);
  }
}
