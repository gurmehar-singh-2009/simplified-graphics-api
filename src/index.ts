import { Engine } from "./core/Engine";
import { Backends } from "./core/Renderer";

let canvas = document.createElement("canvas");
document.body.appendChild(canvas);

let engine = new Engine(canvas, {
  backend: Backends.CANVAS,
  antialias: false,
});

console.log(engine)

engine.start();

engine.onRender = (e) => {
  console.log("onrender");
  // e.setClearColor(255, 255, 0, 1);
  e.clear();

  e.draw();
}
