#version 300 es

precision highp float;

uniform sampler2D u_texture;

in vec3 vtx_colors;
out vec4 color;

void main(){
    color = vec4(vtx_colors, 1);
}