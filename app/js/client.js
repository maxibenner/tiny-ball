export default class Client {
  constructor() {
    this.ws = new WebSocket("ws://localhost:3000");
    this.ws.addEventListener("open", this.onOpen.bind(this));
    this.ws.addEventListener("message", this.onMessage.bind(this));
    this.ws.addEventListener("close", this.onClose.bind(this));
    this.ws.addEventListener("error", this.onError.bind(this));

    this.users = [];
  }

  onOpen(event) {
    console.log("Connected to server " + event.srcElement.url);
  }
  onMessage(event) {
    const data = JSON.parse(event.data);
    console.log(data);
  }
  onClose(event) {
    console.log(event);
  }
  onError(event) {
    console.error(event);
  }
}
