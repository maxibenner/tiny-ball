import World from "./world.js";
import Client from "./client.js";

const canvasContainer = document.getElementById("tinyball-container");
const worldConfig = {
  ballEntry: [0.1, 0.1],
};
console.log(canvasContainer.clientWidth, canvasContainer.clientHeight);
const world = new World(canvasContainer, worldConfig);
world.drawCanvas();

// const client = new Client();
