# version 300 es

void main() {
    triangle = vec2[](
        vec2(0.0, 0.5),
        vec2(0.5, -0.5),
        vec2(-0.5, -0.5),
    );
    gl_Position = vec4(triangle[gl_VertexId], 0, 1);
}