<div align="center">

# Simplified Graphics API (name pending)

<p align=center>
    <sub>A really nice API to work with for graphics programming!</sub>
    <br>
    <sub>Developed at Centennial Collegiate Vocational Institute.</sub>
</p>

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)
![Code Size](https://img.shields.io/github/languages/code-size/gurmehar-singh-2009/araria?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Web-lightgrey?style=flat-square)

</div>

---
> [!CAUTION]
> **This is the experimental branch.** For the stable version switch to the main branch.

> [!NOTE]
> **Library is in active development.** Core systems are currently being written and will change without warning.

> [!IMPORTANT]
> The 3D renderer only supports the `WebGL` and `WebGPU` backend.
> <details>
> <summary>Why not do 3D using the Canvas2D API?</summary>
> <br />
> Simply put, it makes no sense to do 3d graphics using the Canvas2D API for these reasons:<br />
> - Not computationally reasonable. Canvas2D is not guaranteed to be hardware optimized. It makes an attempt by doing as much optimization as it can but it can be unpredictable and we have no control over that.
> - We would reinvent the wheel. In order to do 3D graphics we would have to manipulate the `(x, y, z)` coordinate pairs. Sound familiar? That's what a vertex shader does! And we would have to optimize this by either: (a) creating a WASM module with SIMD, (b) writing compute shaders (arguably dumber because you're now bringing in a gpu pipeline... why not just use that directly?).
>
> </details>

## Features (planned)
- Fully complete 2D renderer.
- Fully complete 3D renderer.
- - Can load .obj files.
- - Supports HBR (High Definition Physically Based Rendering) and has lighting support.
- Fully complete texture + entity system.

## Project Roadmap

| Importance | Feature | Status |
| :---: | :-- | :--- |
| High | 2D shape primitives | In progress |
| High | 3D shape primitives | In progress |
| High | Texture support | In progress |
| Medium | Text Rendering | In Progress |
| Medium | Entities Support built in | Planned |
| Low | WebGL/WebGPU tutorial | Planned |
| Low | Multiplayer network support | Planned |
| Low | Debug panel | In Progress |
| Low | Audio | Discussion |
| Low | Input Handling | Discussion |


## Demo
```ts
import { Backends, Engine } from "simplified-graphics-api";

const gameCanvas = document.createElement("gameCanvas");
document.body.appendChild(gameCanvas);

const engine = new Engine(gameCanvas, {
  backend: Backends.WEBGPU,
  antialias: false,
  debug: false,
});

engine.start();

engine.onFrame = (renderer, timestamp) => {
  renderer.clear(0, 0, 0, 1);

  renderer.setColor(255, 0, 0, 1);
  renderer.drawSquare(40, 40, 50, 50);

  renderer.setColor(255, 255, 255, 1);
  renderer.drawText(50, 100, "Working Demo!", 22);
}
```
