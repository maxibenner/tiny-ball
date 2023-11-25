/**
 * Adds a ball to the world
 * @param {any} render Matter.js render object
 * @param {number} posX Percentage position of the ball on the x axis
 * @param {number} posY Percentage position of the ball on the y axis
 * @param {number} ballWidth Width of the ball
 * @param {string} imgSrc Path to the image of the ball
 *
 */
export default class Ball {
  constructor({ render, posX = 0, posY = 0, ballWidth = 20, imgSrc = null }) {
    this.initializeProperties({ render, posX, posY, ballWidth, imgSrc });
    this.addBall();
    this.setupEventListeners();
  }

  initializeProperties({ render, posX, posY, ballWidth, imgSrc }) {
    this.ctx = render.context;
    this.cWidth = render.canvas.width;
    this.cHeight = render.canvas.height;
    this.posX = posX;
    this.posY = posY;
    this.ballWidth = ballWidth;
    this.imgSrc = imgSrc;
    this.render = render;
    this.body = null;
    this.forceMultiplier = 0.0003;
    this.isDragging = false;
    this.pointerStart = [0, 0];
    this.pointerPos = [0, 0];
  }

  setupEventListeners() {
    const canvas = this.render.canvas;
    canvas.addEventListener("pointerdown", this.onPointerDown.bind(this));
    document.addEventListener("pointermove", this.onPointerMove.bind(this));
    document.addEventListener("pointerup", this.onPointerUp.bind(this));

    Matter.Events.on(this.render.engine, "afterUpdate", this.afterUpdate.bind(this));
  }

  onPointerDown(e) {
    this.setIsStatic(true);
    this.isDragging = true;
    this.pointerStart = [e.clientX, e.clientY];
    this.pointerPos = [e.clientX, e.clientY];
  }

  onPointerMove(e) {
    this.pointerPos = [e.clientX, e.clientY];
  }

  onPointerUp(e) {
    if (this.isDragging) {
      this.handlePointerUp();
    }
  }

  handlePointerUp() {
    this.setIsStatic(false);
    this.isDragging = false;
    const travel = [
      this.pointerPos[0] - this.pointerStart[0],
      (this.pointerPos[1] - this.pointerStart[1]) * -1,
    ];
    this.applyImpulse([
      travel[0] * this.forceMultiplier,
      travel[1] * this.forceMultiplier,
    ]);
    this.resetPointerPositions();
  }

  resetPointerPositions() {
    this.pointerStart = [0, 0];
    this.pointerPos = [0, 0];
  }

  afterUpdate() {
    if (this.isDragging) {
      this.drawPredictedPath();
    }
    this.checkOutOfBounds();
  }

  checkOutOfBounds() {
    if (
      this.body.position.x > this.cWidth + this.ballWidth + 10 ||
      this.body.position.x < 0 - this.ballWidth - 10
    ) {
      Matter.Composite.remove(this.render.engine.world, this.body);
      this.addBall();
    }
  }


  /**
   * Draw a ball at the given percentag
   */
  addBall() {
    this.body = Matter.Bodies.circle(
      this.cWidth * this.posX + this.ballWidth / 2,
      this.cHeight - this.cHeight * this.posY - this.ballWidth / 2,
      this.ballWidth,
      {
        id: "ball",
        restitution: 0.93,
        render: {
          sprite: {
            texture: this.imgSrc ?? null,
            xScale: 0.14,
            yScale: 0.14,
          },
        },
      }
    );

    Matter.Composite.add(this.render.engine.world, [this.body]);
  }

  /**
   * Draw predictive path of the ball
   */
  drawPredictedPath() {
    const x = this.pointerPos[0];
    const y = this.pointerPos[1];
    const circleCenter = { x: this.body.position.x, y: this.body.position.y };
    const forceScale = 0.57;
    const steps = 15;
    const timeStep = 1 / 2;
    const gravity = -9.81;
    const mass = this.body.mass;
    const frictionAir = this.body.friction;

    const force = {
      x: (x - this.pointerStart[0]) * forceScale,
      y: (y - this.pointerStart[1]) * forceScale,
    };

    let position = { ...circleCenter };
    let velocity = { x: force.x / mass, y: force.y / mass };

    for (let i = 1; i <= steps; i++) {
      const acceleration = {
        x: -frictionAir * velocity.x,
        y: -frictionAir * velocity.y - gravity,
      };

      velocity = {
        x: velocity.x + acceleration.x * timeStep,
        y: velocity.y + acceleration.y * timeStep,
      };

      position = {
        x: position.x + velocity.x * timeStep,
        y: position.y + velocity.y * timeStep,
      };

      this.ctx.beginPath();
      this.ctx.fillStyle = `rgba(255, 255, 255, ${1 - i / steps})`;
      this.ctx.arc(position.x, position.y, 3, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  /**
   * Apply an impulse to the ball
   */
  applyImpulse([x, y]) {
    // Make sure that it has been dragged
    if (Math.abs(x + y) > 0) {
      // Remove any velocity before applying impulse
      Matter.Body.setVelocity(this.body, {
        x: 0,
        y: 0,
      });
      Matter.Body.applyForce(this.body, this.body.position, {
        x: x,
        y: -y,
      });
    }
  }

  setIsStatic(bool) {
    this.body.isStatic = bool;
  }
}
