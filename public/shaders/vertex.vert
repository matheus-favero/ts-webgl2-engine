#version 300 es

//just one position per time is sent by typescript
in vec4 a_vtx_position;
in vec3 a_vtx_colors;

uniform mat4 u_rotations;

out vec3 vtx_colors;

void main(){

    vec3[36] colors = vec3[](
        //rosa
        vec3(1, 0, 0.56),
        //ciano
        vec3(0, 1, 0.8),
        //verde
        vec3(0.2, 0.5, 0.2),
        vec3(1, 0, 0.56),
        //roxo
        vec3(0.2, 0.2, 0.5),
        vec3(0, 1, 0.8),

        vec3(0.2, 0.2, 0.5),
        vec3(1, 0, 0.56),
        vec3(0.2, 0.5, 0.2),
        vec3(0.2, 0.2, 0.5),
        vec3(0.2, 0.5, 0.2),
        vec3(0, 1, 0.8),

        vec3(1, 0, 0.56),
        vec3(0.2, 0.2, 0.5),
        vec3(0, 1, 0.8),
        vec3(1, 0, 0.56),
        vec3(0, 1, 0.8),
        vec3(0.2, 0.5, 0.2),

        vec3(0.2, 0.2, 0.5),
        vec3(0.2, 0.5, 0.2),
        vec3(0, 1, 0.8),
        vec3(0.2, 0.2, 0.5),
        vec3(1, 0, 0.56),
        vec3(0.2, 0.5, 0.2),

        vec3(1, 0, 0.56),
        vec3(0, 1, 0.8),
        vec3(0.2, 0.5, 0.2),
        vec3(1, 0, 0.56),
        vec3(0.2, 0.2, 0.5),
        vec3(0, 1, 0.8),

        vec3(1, 0, 0.56),
        vec3(0, 1, 0.8),
        vec3(0.2, 0.5, 0.2),
        vec3(1, 0, 0.56),
        vec3(0.2, 0.2, 0.5),
        vec3(0, 1, 0.8)
    );
    vtx_colors = colors[gl_VertexID];
    
    //float x = a_vtx_position.x;
    //float y = a_vtx_position.y;
    //float z = a_vtx_position.z;

    // float rotationZ = u_rotations.x;
    // float new_xZ = x * cos(rotationZ) + y * -sin(rotationZ);
    // float new_yZ = x * sin(rotationZ) + y * cos(rotationZ);

    // float rotationY = u_rotations.y;
    // float new_xY = new_xZ * cos(rotationY) + z * sin(rotationY);
    // float new_zY = new_xZ * -sin(rotationY) + z * cos(rotationY);

    // float rotationX = u_rotations.z;
    // float new_yX = new_yZ * cos(rotationX) + new_zY * sin(rotationX);
    // float new_zX = new_yZ * -sin(rotationX) + new_zY * cos(rotationX);
    
    //float w = 2.0 + new_zX * 1.0;

    //gl_Position = vec4(new_xY, new_yX, new_zX, w);

    vec4 transformedVector = u_rotations * a_vtx_position;

    gl_Position = vec4(transformedVector);
}

