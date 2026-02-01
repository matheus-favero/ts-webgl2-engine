# version 300 es

void main(){
    vec2 triangle[3] = vec2[](
        vec2(0, 0.5);
        vec2(0.5, -0.5),
        vec2(-0.5, -0.5)
    );
    gl_Position = vec4(triangle[gl_IndexId].x, triangle[gl_Index].y, 0, 1);
}