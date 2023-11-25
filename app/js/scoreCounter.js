export default class ScoreCounter {
  constructor(element, world) {
    this.initializeProperties(element, world);
    this.setupCollisionDetection();
    this.addScoreCounterToDOM();
  }

  initializeProperties(element, world) {
    this.world = world;
    this.container = element;
    this.score = 0;
    this.counter = document.createElement("p");
  }

  setupCollisionDetection() {
    Matter.Events.on(this.world.engine, "collisionStart", (event) => {
      this.handleCollisions(event.pairs);
    });
  }

  handleCollisions(pairs) {
    for (let pair of pairs) {
      if (this.isScoreCollision(pair)) {
        this.updateScore();
      }
    }
  }

  isScoreCollision(pair) {
    return (pair.bodyA.id === "ball" && pair.bodyB.id === "target") ||
      (pair.bodyA.id === "target" && pair.bodyB.id === "ball");
  }

  addScoreCounterToDOM() {
    this.styleCounter();
    this.counter.innerHTML = this.score;
    this.container.appendChild(this.counter);
  }

  styleCounter() {
    Object.assign(this.counter.style, {
      position: "absolute",
      fontFamily: "sans-serif, Helvetica",
      top: "50px",
      left: "50px",
      color: "red",
      fontSize: "2rem",
      fontWeight: "bold",
      zIndex: "100"
    });
  }

  updateScore() {
    this.score++;
    this.counter.innerHTML = this.score;
  }
}
