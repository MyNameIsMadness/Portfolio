#version 300 es

// CSCI 4611 Assignment 5: Artistic Rendering
// You do not need to modify this vertex shader.

precision mediump float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

in vec3 position;
in vec3 normal;
in vec4 color;

out vec3 vertPosition;
out vec3 vertNormal;
out vec4 vertColor;

void main() 
{
    vertPosition = (modelMatrix * vec4(position, 1)).xyz;
    vertNormal = normalize((normalMatrix * vec4(normal, 0)).xyz);
    vertColor = color;
    gl_Position = projectionMatrix * viewMatrix * vec4(vertPosition, 1);
}