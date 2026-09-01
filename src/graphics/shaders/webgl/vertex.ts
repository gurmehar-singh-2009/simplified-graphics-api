export const vertexShaderSource = `#version 300 es
precision highp float;

in vec3 a_position;
in vec2 a_texCoord;

uniform mat4 u_viewProjection;
uniform mat4 u_meshTransform;

out vec2 v_texCoord;

void main() {
    v_texCoord = a_texCoord;
    gl_Position = u_viewProjection * u_meshTransform * vec4(a_position, 1.0);
}`;
