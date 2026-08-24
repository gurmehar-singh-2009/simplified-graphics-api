export const fragmentShaderSource = `#version 300 es

precision highp float;

in vec2 v_texCoord;
in vec4 v_colour;
in float v_type;

uniform sampler2D u_textures[8];

out vec4 outColour;

void main() {
    if (int(v_type) == 0) {
        vec4 texColor;
        texColor = texture(u_textures[0], v_texCoord);
        outColour = texColor * v_colour;
    } else if (int(v_type) == 1) {
        outColour = v_colour;
    } else {
        vec2 uv = v_texCoord - vec2(0.5);
        float distSq = dot(uv, uv);
        if(distSq > 0.25) discard;
        outColour = v_colour;
    }
}`