export const vertexShaderSource = `#version 300 es

layout(location = 0) in vec2 a_position;
layout(location = 3) in vec2 a_texCoord;
layout(location = 4) in vec4 a_colour;
layout(location = 5) in float a_type;

out vec2 v_texCoord;
out vec4 v_colour;
out float v_type;

uniform vec2 u_resolution;

void main() {
    v_texCoord = a_texCoord;
    v_colour = a_colour;
    v_type = a_type;

    vec2 screenSpace = ((a_position / u_resolution) * 2.0) - 1.0;
    gl_Position = vec4(screenSpace.x, -screenSpace.y, 0.0, 1.0);
}`