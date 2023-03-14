import World from "./world.js";

const canvasContainer = document.getElementById("world-container");
const worldConfig = {
  ballEntry: [0.1, 0.1],
};
const world = new World(canvasContainer, worldConfig);
world.drawCanvas();
