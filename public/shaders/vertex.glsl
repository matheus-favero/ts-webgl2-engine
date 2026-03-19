# version 300 es

out vec4 vertex_color;

void main(){
    vec4 colors[6] = vec4[](
        vec4(0.5, 1, 0.2, 1),
        vec4(1, 0.1, 0.2, 1),
        vec4(1, 1, 1, 1),
        vec4(0.5, 1, 0.2, 1),
        vec4(1, 0.1, 0.2, 1),
        vec4(1, 1, 1, 1)
    );
    vertex_color = colors[gl_VertexID];

    vec2 triangle[6] = vec2[](
        vec2(-0.5, 0.5),
        vec2(0.5, 0.5),
        vec2(0.5, -0.5),

        vec2(-0.5, 0.5),
        vec2(0.5, -0.5),
        vec2(-0.5, -0.5)
    );
    gl_Position = vec4(triangle[gl_VertexID].x, triangle[gl_VertexID].y, 0, 1);
}