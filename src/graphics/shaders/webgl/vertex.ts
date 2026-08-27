export const vertexShaderSource = `#version 300 es

layout(location = 0) in vec3 a_position;
layout(location = 3) in vec2 a_texCoord;
layout(location = 4) in vec4 a_colour;
layout(location = 5) in float a_type;

out vec2 v_texCoord;
out vec4 v_colour;
out float v_type;

uniform mat4 u_viewProjection;

void main() {
    v_texCoord = a_texCoord;
    v_colour = a_colour;
    v_type = a_type;

    gl_Position = u_viewProjection * vec4(a_position, 1.0);
}`;
