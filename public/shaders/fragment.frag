#version 300 es

precision highp float;

uniform sampler2D u_texture;
//in vec2 texture_uv;
in vec3 vtx_colors;
out vec4 color;

void main(){
    //color = texture(u_texture, texture_uv);
    color = vec4(vtx_colors, 1);
}