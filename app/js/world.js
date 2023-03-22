import Ball from "./ball.js";

export default class World {
  constructor(canvasContainer, worldConfig) {
    // DOM
    this.canvasContainer = canvasContainer;
    this.canvasContainer.style.flexGrow = 1;
    this.canvasContainer.style.position = "relative";
    this.canvasContainer.style.overflow = "hidden";
    this.counter = document.createElement("p");

    // App settings
    this.ballEntry = worldConfig.ballEntry ?? [0.5, 0.5];
    this.ballWidth = 20;
    this.targetEntry = worldConfig.targetEntry ?? [0.9, 0.2];

    // Init app vars
    this.score = 0;

    // Dom vars
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
    this.resizeCanvas();

    // Add context to variables
    this.ctx = this.render.context;

    // Style canvas
    this.render.canvas.style.borderRadius = "25px";
    this.render.canvas.style.position = "absolute";
    this.render.canvas.style.top = 0;
    this.render.canvas.style.left = "50%";
    this.render.canvas.style.transform = "translateX(-50%)";
    this.render.canvas.style.transformOrigin = "left top";
    this.render.canvas.style.margin = "0 auto";

    // Add Elements
    this.addGround();
    this.addTarget(this.targetEntry);

    this.Ball = new Ball({
      render: this.render,
      posX: worldConfig.ballEntry[0],
      posY: worldConfig.ballEntry[1],
      imgSrc: "./assets/basketball.png",
    });

    // UI
    this.addScore();

    // Init mouse dragging behaviour
    this.isDragging = false;
    this.pointerStartClient = [];
    this.pointerPosClient = [];

    // Init resize behaviour
    window.addEventListener("resize", () => this.resizeCanvas());

    // Detect collisions between ball and target
    Matter.Events.on(this.engine, "collisionStart", (event) => {
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
  }

  drawCanvas() {
    // Render setup
    Matter.Render.run(this.render);

    // Run the gameloop
    Matter.Runner.run(this.runner, this.engine);
  }

  addScore() {
    this.counter.style.position = "absolute";
    this.counter.style.fontFamily = "sans-serif, Helvetica";
    this.counter.style.top = "50px";
    this.counter.style.left = "50px";
    this.counter.style.color = "white";
    this.counter.style.fontSize = "2rem";
    this.counter.style.fontWeight = "bold";
    this.counter.style.zIndex = "100";
    this.counter.innerHTML = this.score;
    this.canvasContainer.appendChild(this.counter);
  }

  updateScore() {
    this.score++;
    this.counter.innerHTML = this.score;
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
    // Get new canvas size
    this.dimension = Math.min(
      this.canvasContainer.clientWidth,
      this.canvasContainer.clientHeight
    );
    this.scale = this.dimension / this.baseWidth;

    // Set new canvas scale
    // this.render.canvas.style.transform = `scale(${this.scale})`;
    this.render.canvas.style.scale = this.scale;

    // Update render
    // this.render.bounds.max.x = this.cWidth;
    // this.render.bounds.max.y = this.cHeight;
    // this.render.options.width = this.cWidth;
    // this.render.options.height = this.cHeight;
    // this.render.canvas.width = this.cWidth;
    // this.render.canvas.height = this.cHeight;

    // Update Ball
    // Matter.Body.setPosition(this.ball, {
    //   x: this.cWidth * this.ballX + this.ballWidth,
    //   y: this.cHeight - this.cHeight * this.ballY - this.ballWidth,
    // });

    // Update ground
    // Matter.Body.setPosition(this.ground, {
    //   x: this.cWidth / 2,
    //   y: this.cHeight,
    // });
    // Matter.Body.setVertices(this.ground, [
    //   { x: 0, y: 0 },
    //   { x: this.cWidth, y: 0 },
    //   { x: this.cWidth, y: 50 },
    //   { x: 0, y: 50 },
    // ]);

    // // Update target
    // Matter.Body.setPosition(this.target, {
    //   x: this.cWidth * this.targetX,
    //   y: this.cHeight * this.targetY,
    // });
  }
}

// // Bucket
// var group = Body.nextGroup(true);
// var lineOne = Composites.stack(
//   cWidth - cWidth / 6,
//   300,
//   1,
//   5,
//   0,
//   1,
//   chainlinkHeavy
// );
// var lineTwo = Composites.stack(
//   cWidth - cWidth / 6 + 50,
//   300,
//   1,
//   5,
//   0,
//   1,
//   chainlinkHeavy
// );
// var lineThree = Composites.stack(
//   cWidth - cWidth / 6,
//   308,
//   5,
//   1,
//   1,
//   0,
//   chainlinkLight
// );
// Composites.chain(lineOne, 0.5, 0, 0, 0, { stiffness: 0.9 });
// Composites.chain(lineTwo, 0.5, 0, 0, 0, { stiffness: 0.9 });
// Composites.chain(lineThree, 0.5, 0, 0, 0, { stiffness: 0.9 });

// function chainlinkHeavy(x, y) {
//   return Bodies.circle(x, y, 10, {
//     collisionFilter: { group: group },
//     density: 0.01,
//     // isStatic: true,
//   });
// }
// function chainlinkLight(x, y) {
//   return Bodies.circle(x, y, 10, {
//     collisionFilter: { mask: 0 },
//     density: 0.001,
//     // isStatic: true,
//   });
// }

// // Ground
// var ground = Bodies.rectangle(cWidth / 2, cHeight, 10000, 60, {
//   isStatic: true,
// });

// var composite = Composite.add(engine.world, [
//   ball,
//   lineOne,
//   lineTwo,
//   lineThree,
//   ground,
//   // Bucket constraints
//   Constraint.create({
//     pointA: { x: cWidth - cWidth / 6, y: 300 },
//     bodyB: lineOne.bodies[0],
//   }),
//   Constraint.create({
//     pointA: { x: cWidth - cWidth / 6 + 50, y: 300 },
//     bodyB: lineTwo.bodies[0],
//   }),
//   Constraint.create({
//     bodyA: lineThree.bodies[0],
//     bodyB: lineOne.bodies[1],
//   }),
//   Constraint.create({
//     bodyA: lineThree.bodies[lineThree.bodies.length - 1],
//     bodyB: lineTwo.bodies[1],
//   }),
// ]);

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
