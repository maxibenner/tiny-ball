import World from "./world.js";
import Client from "./client.js";

const canvasContainer = document.getElementById("tinyball-container");
const worldConfig = {
  ballEntry: [0.1, 0.1],
};
const world = new World(canvasContainer, worldConfig);
world.drawCanvas();

// const client = new Client();
