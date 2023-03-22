/**
 * Adds a score counter to the world
 * @param {HTMLElement} element DOM element to append the score counter to
 * @param {World} world World class
 */
export default class ScoreCounter {
  constructor(element, world) {
    this.world = world;
    this.container = element;
    this.score = 0;
    this.counter = document.createElement("p");

    // Detect collisions between ball and target
    Matter.Events.on(this.world.engine, "collisionStart", (event) => {
      var pairs = event.pairs;
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        if (
          (pair.bodyA.id === "ball" && pair.bodyB.id === "target") ||
          (pair.bodyA.id === "target" && pair.bodyB === "ball")
        ) {
          // Count score
          this.updateScore();
        }
      }
    });

    this.addScore();
  }

  addScore() {
    this.counter.style.position = "absolute";
    this.counter.style.fontFamily = "sans-serif, Helvetica";
    this.counter.style.top = "50px";
    this.counter.style.left = "50px";
    this.counter.style.color = "red";
    this.counter.style.fontSize = "2rem";
    this.counter.style.fontWeight = "bold";
    this.counter.style.zIndex = "100";
    this.counter.innerHTML = this.score;
    this.container.appendChild(this.counter);
  }

  updateScore() {
    this.score++;
    this.counter.innerHTML = this.score;
  }
}
