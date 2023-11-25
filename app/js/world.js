import Ball from "./ball.js";
import Bucket from "./bucket.js";

export default class World {
  constructor(canvasContainer, worldConfig) {
    this.initializeProperties(canvasContainer, worldConfig);
    this.initializeDOM();
    this.styleContainer();
    this.addElements();
    this.initializeResizeBehavior();
    this.drawCanvas();
  }

  initializeProperties(canvasContainer, worldConfig) {
    this.canvasContainer = canvasContainer;
    this.ballEntry = worldConfig.ballEntry ?? [0.5, 0.5];
    this.ballWidth = 20;
    this.targetEntry = worldConfig.targetEntry ?? [0.9, 0.2];
    this.baseWidth = 600;
    this.dimension = Math.min(canvasContainer.clientWidth, canvasContainer.clientHeight);
    this.scale = this.dimension / this.baseWidth;
  }

  initializeDOM() {
    this.engine = Matter.Engine.create();
    this.runner = Matter.Runner.create();
    this.render = Matter.Render.create({
      element: this.canvasContainer,
      engine: this.engine,
      options: {
        width: this.baseWidth,
        height: this.baseWidth,
        wireframes: false,
        background: "transparent",
      }
    });

    this.resizeCanvas();
  }

  styleContainer() {
    this.canvasContainer.style.flexGrow = 1;
    this.canvasContainer.style.position = "relative";
    this.canvasContainer.style.overflow = "hidden";

    this.styleCanvas();
  }

  styleCanvas() {
    const canvasStyle = this.render.canvas.style;
    canvasStyle.borderRadius = "25px";
    canvasStyle.position = "absolute";
    canvasStyle.top = 0;
    canvasStyle.left = "50%";
    canvasStyle.transform = "translateX(-50%)";
    canvasStyle.transformOrigin = "left top";
    canvasStyle.margin = "0 auto";
  }

  addElements() {
    this.bucket = new Bucket(this.render);
    this.addGround();
    this.addTarget(this.targetEntry);

    this.ball = new Ball({
      render: this.render,
      posX: this.ballEntry[0],
      posY: this.ballEntry[1],
      imgSrc: "./assets/basketball.png",
    });
  }

  initializeResizeBehavior() {
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  drawCanvas() {
    Matter.Render.run(this.render);
    Matter.Runner.run(this.runner, this.engine);
  }

  addGround() {
    this.ground = Matter.Bodies.rectangle(
      this.baseWidth / 2,
      this.baseWidth,
      this.baseWidth,
      50,
      { isStatic: true, id: "ground" }
    );
    Matter.Composite.add(this.engine.world, [this.ground]);
  }

  addTarget([x, y]) {
    this.targetX = x;
    this.targetY = y;
    this.target = Matter.Bodies.rectangle(
      this.baseWidth * x,
      this.baseWidth * y,
      20,
      120,
      {
        id: "target",
        isStatic: true,
      }
    );
    Matter.Composite.add(this.engine.world, [this.target]);
  }

  resizeCanvas() {
    this.dimension = Math.min(
      this.canvasContainer.clientWidth,
      this.canvasContainer.clientHeight
    );
    this.scale = this.dimension / this.baseWidth;
    this.render.canvas.style.scale = this.scale;
  }
}
