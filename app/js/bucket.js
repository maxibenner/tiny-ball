/**
 * Represents a bucket in the world using Matter.js.
 */
export default class Bucket {
  /**
   * Creates an instance of Bucket.
   * @param {Matter.Render} render - The Matter.js render object.
   */
  constructor(render) {
    this.render = render;
    this.dimension = render.canvas.width; // Assuming dimension is based on the canvas width

    this.addBucketToWorld();
  }

  /**
   * Adds the bucket to the world by creating lines and constraints.
   */
  addBucketToWorld() {
    const group = Matter.Body.nextGroup(true);
    const lineOne = this.createLine(300, 5, group, this.chainlinkHeavy);
    const lineTwo = this.createLine(300, 5, group, this.chainlinkHeavy, 50);
    const lineThree = this.createLine(308, 1, group, this.chainlinkLight);

    this.chainLines(lineOne, lineTwo, lineThree);
    this.addConstraints(lineOne, lineTwo, lineThree);
  }

  /**
   * Creates a line of bodies in the world.
   * @param {number} y - The Y-coordinate for the line.
   * @param {number} stackCount - The number of bodies in the stack.
   * @param {Matter.Body} group - The collision group for the bodies.
   * @param {Function} chainLinkFunction - The function to create a chain link.
   * @param {number} [xOffset=0] - The X-offset for the line position.
   * @returns {Matter.Composite} The line composite created.
   */
  createLine(y, stackCount, group, chainLinkFunction, xOffset = 0) {
    return Matter.Composites.stack(
      this.dimension - this.dimension / 6 + xOffset,
      y,
      stackCount === 1 ? 5 : 1,
      stackCount === 1 ? 1 : 5,
      0,
      1,
      chainLinkFunction.bind(this, group)
    );
  }

  /**
   * Chains the given lines together.
   * @param {Matter.Composite} lineOne - The first line to chain.
   * @param {Matter.Composite} lineTwo - The second line to chain.
   * @param {Matter.Composite} lineThree - The third line to chain.
   */
  chainLines(lineOne, lineTwo, lineThree) {
    const chainOptions = { stiffness: 0.9 };
    Matter.Composites.chain(lineOne, 0.5, 0, 0, 0, chainOptions);
    Matter.Composites.chain(lineTwo, 0.5, 0, 0, 0, chainOptions);
    Matter.Composites.chain(lineThree, 0.5, 0, 0, 0, chainOptions);
  }

  /**
   * Adds constraints between the lines and the world.
   * @param {Matter.Composite} lineOne - The first line composite.
   * @param {Matter.Composite} lineTwo - The second line composite.
   * @param {Matter.Composite} lineThree - The third line composite.
   */
  addConstraints(lineOne, lineTwo, lineThree) {
    const constraints = [
      this.createConstraint(this.dimension - this.dimension / 6, 300, lineOne.bodies[0]),
      this.createConstraint(this.dimension - this.dimension / 6 + 50, 300, lineTwo.bodies[0]),
      this.createLinkConstraint(lineThree.bodies[0], lineOne.bodies[1]),
      this.createLinkConstraint(lineThree.bodies[lineThree.bodies.length - 1], lineTwo.bodies[1]),
    ];
    Matter.Composite.add(this.render.engine.world, constraints);
  }

  /**
   * Creates a constraint for the bucket.
   * @param {number} x - The X-coordinate for the constraint point.
   * @param {number} y - The Y-coordinate for the constraint point.
   * @param {Matter.Body} bodyB - The body to attach the constraint to.
   * @returns {Matter.Constraint} The created constraint.
   */
  createConstraint(x, y, bodyB) {
    return Matter.Constraint.create({
      pointA: { x, y },
      bodyB: bodyB,
    });
  }

  /**
   * Creates a constraint linking two bodies together.
   * @param {Matter.Body} bodyA - The first body to link.
   * @param {Matter.Body} bodyB - The second body to link.
   * @returns {Matter.Constraint} The created link constraint.
   */
  createLinkConstraint(bodyA, bodyB) {
    return Matter.Constraint.create({ bodyA, bodyB });
  }

  /**
   * Creates a heavy chain link for the bucket.
   * @param {Matter.Body} group - The collision group for the chain link.
   * @param {number} x - The X-coordinate of the chain link.
   * @param {number} y - The Y-coordinate of the chain link.
   * @returns {Matter.Body} The created heavy chain link body.
   */
  chainlinkHeavy(group, x, y) {
    return Matter.Bodies.circle(x, y, 10, {
      collisionFilter: { group: group },
      density: 0.01,
    });
  }

  /**
   * Creates a light chain link for the bucket.
   * @param {Matter.Body} group - The collision group for the chain link.
   * @param {number} x - The X-coordinate of the chain link.
   * @param {number} y - The Y-coordinate of the chain link.
   * @returns {Matter.Body} The created light chain link body.
   */
  chainlinkLight(group, x, y) {
    return Matter.Bodies.circle(x, y, 10, {
      collisionFilter: { mask: 0 },
      density: 0.001,
    });
  }
}
