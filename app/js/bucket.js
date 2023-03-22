/**
 * Adds a bucket to the world
 */
export default class Bucket {
  constructor(render) {
    this.render = render;

    var group = Matter.Body.nextGroup(true);
    var lineOne = Matter.Composites.stack(
      this.dimension - this.dimension / 6,
      300,
      1,
      5,
      0,
      1,
      chainlinkHeavy
    );
    var lineTwo = Matter.Composites.stack(
      this.dimension - this.dimension / 6 + 50,
      300,
      1,
      5,
      0,
      1,
      chainlinkHeavy
    );
    var lineThree = Matter.Composites.stack(
      this.dimension - this.dimension / 6,
      308,
      5,
      1,
      1,
      0,
      chainlinkLight
    );
    Matter.Composites.chain(lineOne, 0.5, 0, 0, 0, { stiffness: 0.9 });
    Matter.Composites.chain(lineTwo, 0.5, 0, 0, 0, { stiffness: 0.9 });
    Matter.Composites.chain(lineThree, 0.5, 0, 0, 0, { stiffness: 0.9 });

    function chainlinkHeavy(x, y) {
      return Matter.Bodies.circle(x, y, 10, {
        collisionFilter: { group: group },
        density: 0.01,
        // isStatic: true,
      });
    }
    function chainlinkLight(x, y) {
      return Matter.Bodies.circle(x, y, 10, {
        collisionFilter: { mask: 0 },
        density: 0.001,
        // isStatic: true,
      });
    }
    Matter.Composite.add(this.render.engine.world, [
      lineOne,
      lineTwo,
      lineThree,
      Matter.Constraint.create({
        pointA: { x: this.dimension - this.dimension / 6, y: 300 },
        bodyB: lineOne.bodies[0],
      }),
      Matter.Constraint.create({
        pointA: { x: this.dimension - this.dimension / 6 + 50, y: 300 },
        bodyB: lineTwo.bodies[0],
      }),
      Matter.Constraint.create({
        bodyA: lineThree.bodies[0],
        bodyB: lineOne.bodies[1],
      }),
      Matter.Constraint.create({
        bodyA: lineThree.bodies[lineThree.bodies.length - 1],
        bodyB: lineTwo.bodies[1],
      }),
    ]);
  }
}
