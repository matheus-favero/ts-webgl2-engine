#version 300 es

//just one position per time is sent by typescript
in vec4 a_vtx_position;
in vec3 a_vtx_normals;

uniform mat4 u_transformations;
uniform vec4 u_colors;
uniform vec3 u_lightning;

out vec4 vtx_colors;

void main(){
    vec4 rotated_faces = u_transformations * vec4(a_vtx_normals, 1);
    vtx_colors = u_colors * (rotated_faces.x + u_lightning.x) * (rotated_faces.y + u_lightning.y) * (rotated_faces.z + u_lightning.z);

    vec4 transformedVector = u_transformations * a_vtx_position;

    gl_Position = vec4(transformedVector);
}