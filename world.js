export default class World {
  constructor(canvasContainer, worldConfig) {
    // DOM
    this.canvasContainer = canvasContainer;
    this.canvas = document.createElement("canvas");
    this.canvas.style.borderRadius = "20px";
    this.canvasContainer.appendChild(this.canvas);

    // Canvas dimensions
    this.cWidth = this.canvasContainer.clientWidth;
    this.cHeight = this.canvasContainer.clientHeight;

    // App settings
    this.ballEntry = worldConfig.ballEntry ?? [0.5, 0.5];
    this.ballWidth = 20;

    // Initialize Matter modules
    this.Engine = Matter.Engine;
    this.Events = Matter.Events;
    this.Runner = Matter.Runner;
    this.Render = Matter.Render;
    this.Composite = Matter.Composite;
    this.Composites = Matter.Composites;
    this.Body = Matter.Body;
    this.Bodies = Matter.Bodies;
    this.Constraint = Matter.Constraint;

    this.engine = this.Engine.create();
    this.runner = this.Runner.create();
    this.render = this.Render.create({
      canvas: this.canvas,
      engine: this.engine,
      options: {
        width: this.cWidth,
        height: this.cHeight,
        wireframes: false,
      },
    });

    // Add context to variables
    this.ctx = this.render.context;

    // Add Elements
    this.addGround();
    this.addTarget();
    this.addBall(this.ballEntry);

    // Init mouse dragging behaviour
    this.isDragging = false;
    this.pointerStartClient = [];
    this.pointerPosClient = [];

    this.canvas.addEventListener("pointerdown", (e) => {
      this.ball.isStatic = true;
      this.isDragging = true;
      this.pointerStartClient = [e.clientX, e.clientY];
    });
    document.addEventListener("pointerup", (e) => {
      if (this.isDragging) {
        this.ball.isStatic = false;
        this.isDragging = false;

        const pointerEndClient = [e.clientX, e.clientY];
        const pointerTravel = [
          pointerEndClient[0] - this.pointerStartClient[0],
          this.pointerStartClient[1] - pointerEndClient[1],
        ];

        this.applyImpulse(pointerTravel);

        // Reset
        this.pointerStartClient = [0, 0];
        this.pointerTravel = [0, 0];
        this.pointerPosClient = [0, 0];
      }
    });
    document.addEventListener("pointermove", (e) => {
      this.pointerPosClient = [e.clientX, e.clientY];
    });

    // Init resize behaviour
    window.addEventListener("resize", () => this.resizeCanvas());

    // Draw canvas elements
    this.Events.on(this.engine, "afterUpdate", () => {
      if (this.isDragging) {
        this.drawBallPath();
      }

      // Check if ball is out of bounds
      if (
        this.ball.position.x > this.cWidth + this.ballWidth + 50 ||
        this.ball.position.x < 0 - this.ballWidth - 50
      ) {
        // Remove ball and re-add ball
        this.Composite.remove(this.engine.world, this.ball);
        this.addBall(this.ballEntry);
      }
    });
  }

  drawCanvas() {
    // Render setup
    this.Render.run(this.render);

    // Run the gameloop
    this.Runner.run(this.runner, this.engine);
  }

  /** Add static ground to the world */
  addGround() {
    this.ground = this.Bodies.rectangle(
      this.cWidth / 2,
      this.cHeight,
      this.cWidth,
      50,
      { isStatic: true }
    );
    this.Composite.add(this.engine.world, [this.ground]);
  }

  /** Add target */
  addTarget() {
    this.target = this.Bodies.rectangle(
      this.cWidth / 1.1,
      this.cWidth / 8,
      20,
      120,
      {
        isStatic: true,
      }
    );
    this.Composite.add(this.engine.world, [this.target]);
  }

  /**
   * Draws a ball at the given percentag
   * @param {[number,number]} percentag Percentage x and y (0-1) of canvas
   */
  addBall([x, y]) {
    this.ballX = x;
    this.ballY = y;
    this.ball = this.Bodies.circle(
      this.cWidth * x + this.ballWidth,
      this.cHeight - this.cHeight * y - this.ballWidth,
      this.ballWidth,
      {
        id: "ball",
        restitution: 0.93,
        render: {
          sprite: {
            texture: "assets/basketball.png",
            xScale: 0.14,
            yScale: 0.14,
          },
        },
        // isStatic: true,
      }
    );

    this.Composite.add(this.engine.world, [this.ball]);
  }

  // Draws predictive travel path of ball
  drawBallPath() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "white";
    this.ctx.moveTo(this.ball.position.x, this.ball.position.y);

    // Line from ball to opposite direction of drag path
    this.ctx.lineTo(
      this.ball.position.x +
        (this.pointerStartClient[0] - this.pointerPosClient[0]),
      this.ball.position.y +
        (this.pointerStartClient[1] - this.pointerPosClient[1])
    );
    this.ctx.stroke();
  }

  /**
   * @param {[number,number]} impulse Impulse x and y
   */
  applyImpulse([x, y]) {
    // Make sure that it has been dragged
    if (Math.abs(x + y) > 0) {
      // Remove any velocity before applying impulse
      this.Body.setVelocity(this.ball, {
        x: 0,
        y: 0,
      });
      this.Body.applyForce(this.ball, this.ball.position, {
        x: x * -0.0003,
        y: y * 0.0003,
      });
    }
  }

  resizeCanvas() {
    // Get new canvas size
    this.cWidth = this.canvasContainer.clientWidth;
    this.cHeight = this.canvasContainer.clientHeight;

    // Update render
    this.render.bounds.max.x = this.cWidth;
    this.render.bounds.max.y = this.cHeight;
    this.render.options.width = this.cWidth;
    this.render.options.height = this.cHeight;
    this.render.canvas.width = this.cWidth;
    this.render.canvas.height = this.cHeight;

    // Update Ball
    this.Body.setPosition(this.ball, {
      x: this.cWidth * this.ballX + this.ballWidth,
      y: this.cHeight - this.cHeight * this.ballY - this.ballWidth,
    });

    // Update ground
    this.Body.setPosition(this.ground, {
      x: this.cWidth / 2,
      y: this.cHeight,
    });
    this.Body.setVertices(this.ground, [
      { x: 0, y: 0 },
      { x: this.cWidth, y: 0 },
      { x: this.cWidth, y: 50 },
      { x: 0, y: 50 },
    ]);
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
