#version 300 es

// CSCI 4611 Assignment 5: Artistic Rendering
// You should modify this vertex shader to move the edge vertex
// along the normal away from the mesh surface if you determine
// that the vertex belongs to a silhouette edge.

precision mediump float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform float thickness;

in vec3 position;
in vec3 normal;
in vec3 leftNormal;
in vec3 rightNormal;

void main() 
{
    vec3 pos = position;
    vec3 e = -vec3(modelViewMatrix * vec4(position, 1)).xyz;
    vec3 ln = normalize(vec3(normalMatrix * vec4(leftNormal, 1)).xyz);
    vec3 rn = normalize(vec3(normalMatrix * vec4(rightNormal, 1)).xyz);
    float nldote = dot(ln, e);
    float nrdote = dot(rn, e);

    if (nldote * nrdote < 0.0) 
    {
        pos += thickness * normal;
    }


    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1);
}