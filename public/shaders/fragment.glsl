# version 300 es

precision lowp float;

in vec4 vertex_color;
out vec4 color;

void main(){
    color = vertex_color;
}