#version 300 es

//just one position per time is sent by typescript
in vec4 a_vtx_position;
in vec3 a_vtx_normals;

uniform mat4 u_rotations;
uniform vec3 u_colors;

out vec3 vtx_colors;

void main(){
    
    //vtx_colors = colors[gl_VertexID];
    vtx_colors = u_colors * a_vtx_normals.y;

    vec4 transformedVector = u_rotations * a_vtx_position;

    gl_Position = vec4(transformedVector);
}

