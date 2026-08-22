// design idea:
// do the below thing for all 3 render backends
// because they all vary so much (canvas2d can just be a bunch of arrays, while webgpu needs actual buffer allocation and resizing)

import type { RenderConfigs, Renderer } from "../Renderer";

export class CanvasRenderer implements Renderer {
	configs: RenderConfigs;

	constructor(configs: RenderConfigs) {
		this.configs = configs;
	}

	start(): void {}

	onRender(): void {}
}
