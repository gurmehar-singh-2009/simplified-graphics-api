export const fragmentShaderSource = `#version 300 es

precision highp float;

in vec2 v_texCoord;

uniform sampler2D u_textures[8];

out vec4 outColour;

void main() {
    outColour = vec4(1.0, 0.0, 0.0, 1.0);
}`;
