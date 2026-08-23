import { Engine } from "./core/Engine";
import { Backends } from "./core/Renderer";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const engine = new Engine(canvas, {
  backend: Backends.CANVAS,
  antialias: true,
});

console.log(engine)

engine.start();

engine.onRender = (e) => {
  e.clear(255, 0, 0, 1);

  e.set2DColor(255, 0, 0, 1);
  e.drawSquare(40, 40, 20, 20);

  e.set2DColor(0, 255, 0, 1);
  e.drawTriangle(80, 80, 100, 100, 0, 100);

  e.set2DColor(0, 0, 255, 1);
  e.drawOctogon(180, 60, 25);

  e.set2DColor(0, 0, 0, 1);
  e.drawPentagon(250, 200, 40);

  e.draw();
}
