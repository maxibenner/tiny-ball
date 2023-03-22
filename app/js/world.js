import Ball from "./ball.js";
import Bucket from "./bucket.js";

export default class World {
  constructor(canvasContainer, worldConfig) {
    // App config
    this.ballEntry = worldConfig.ballEntry ?? [0.5, 0.5];
    this.ballWidth = 20;
    this.targetEntry = worldConfig.targetEntry ?? [0.9, 0.2];

    // Init DOM
    this.canvasContainer = canvasContainer;

    // Style container
    this.canvasContainer.style.flexGrow = 1;
    this.canvasContainer.style.position = "relative";
    this.canvasContainer.style.overflow = "hidden";

    // State
    // Functional vars
    this.baseWidth = 600;
    this.dimension = Math.min(
      this.canvasContainer.clientWidth,
      this.canvasContainer.clientHeight
    );
    this.scale = this.dimension / this.baseWidth;

    // Initialize Matter modules
    this.engine = Matter.Engine.create();
    this.runner = Matter.Runner.create();
    this.render = Matter.Render.create({
      element: this.canvasContainer,
      engine: this.engine,
      options: {
        width: this.baseWidth,
        height: this.baseWidth,
        wireframes: false,
      },
    });
    // Set scale
    this.resizeCanvas();

    // Style canvas
    this.render.canvas.style.borderRadius = "25px";
    this.render.canvas.style.position = "absolute";
    this.render.canvas.style.top = 0;
    this.render.canvas.style.left = "50%";
    this.render.canvas.style.transform = "translateX(-50%)";
    this.render.canvas.style.transformOrigin = "left top";
    this.render.canvas.style.margin = "0 auto";

    // Add Elements
    this.bucket = new Bucket(this.render);
    this.addGround();
    this.addTarget(this.targetEntry);

    this.Ball = new Ball({
      render: this.render,
      posX: worldConfig.ballEntry[0],
      posY: worldConfig.ballEntry[1],
      imgSrc: "./assets/basketball.png",
    });

    // Init resize behaviour
    window.addEventListener("resize", () => this.resizeCanvas());

    this.drawCanvas();
  }

  drawCanvas() {
    // Render setup
    Matter.Render.run(this.render);

    // Run the gameloop
    Matter.Runner.run(this.runner, this.engine);
  }

  /** Add static ground to the world */
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

  /** Add target */
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
    // Get updated container size and update canvas scale
    this.dimension = Math.min(
      this.canvasContainer.clientWidth,
      this.canvasContainer.clientHeight
    );
    this.scale = this.dimension / this.baseWidth;
    this.render.canvas.style.scale = this.scale;
  }
}

// // Add mouse control
// var mouse = Matter.Mouse.create(render.canvas);
// var mouseConstraint = Matter.MouseConstraint.create(engine, {
//   mouse: mouse,
//   constraint: {
//     stiffness: 0.2,
//     render: {
//       visible: false,
//     },
//   },
// });

// Composite.add(engine.world, mouseConstraint);
// // Keep render in sync with mouse
// render.mouse = mouse;
