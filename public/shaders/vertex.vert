#version 300 es

//just one position per time is sent by typescript
in vec3 a_vtx_position;
out vec3 vtx_colors;
//out vec2 texture_uv;

void main(){

    /*vec2[3] uv = vec2[](
        vec2(0.5, 0),
        vec2(1, 1),
        vec2(0, 1)
    );
    texture_uv = uv[gl_VertexID];*/

    vec3[6] colors = vec3[](
        vec3(1, 0, 0.56),
        vec3(0, 1, 0.8),
        vec3(0.2, 0.5, 0.2),

        vec3(1, 0, 0.56),
        vec3(0.2, 0.2, 0.5),
        vec3(0, 1, 0.8)
    );
    vtx_colors = colors[gl_VertexID];
    
    gl_Position = vec4(a_vtx_position.x, a_vtx_position.y, a_vtx_position.z, 1);
}