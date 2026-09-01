// shouldnt technically be here but im lazy

export interface GlyphMetrics {
	u0: number;
	v0: number;
	u1: number;
	v1: number; // normalized uv rect in the atlas
	width: number;
	height: number; // pixel size to render this glyph
	advance: number;
}

export class FontAtlas {
	public readonly canvas: HTMLCanvasElement | OffscreenCanvas;
	public readonly glyphs = new Map<string, GlyphMetrics>();
	public readonly baseSize: number;
	public readonly spaceAdvance: number;

	constructor(
		font = "sans-serif",
		baseSize = 256,
		charset = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
		atlasSize = 2048,
	) {
		this.baseSize = baseSize;
		this.canvas = new OffscreenCanvas(atlasSize, atlasSize);
		const ctx = this.canvas.getContext("2d")!;
		ctx.font = `${baseSize}px ${font}`;
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillStyle = "white";

		const padding = 2;
		let cursorX = 0,
			cursorY = 0,
			rowHeight = 0;

		for (const ch of charset) {
			const m = ctx.measureText(ch);

			const left = Math.ceil(m.actualBoundingBoxLeft ?? 0);
			const right = Math.ceil(m.actualBoundingBoxRight ?? m.width);
			const ascent = Math.ceil(m.actualBoundingBoxAscent);
			const descent = Math.ceil(m.actualBoundingBoxDescent);

			const w = left + right + padding * 2;
			const h = ascent + descent + padding * 2;

			if (cursorX + w > atlasSize) {
				cursorX = 0;
				cursorY += rowHeight + padding;
				rowHeight = 0;
			}

			ctx.fillText(ch, cursorX + left + padding, cursorY + ascent + padding);

			this.glyphs.set(ch, {
				u0: cursorX / atlasSize,
				v0: cursorY / atlasSize,
				u1: (cursorX + w) / atlasSize,
				v1: (cursorY + h) / atlasSize,
				width: w,
				height: h,
				advance: m.width,
			});

			cursorX += w;
			rowHeight = Math.max(rowHeight, h);
		}

		this.spaceAdvance = this.glyphs.get(" ")?.advance ?? baseSize * 0.3;
	}
}
