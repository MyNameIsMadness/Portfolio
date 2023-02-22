#version 300 es

// CSCI 4611 Assignment 5: Artistic Rendering
// You do not need to modify this fragment shader.

precision mediump float;

uniform vec3 color;

out vec4 fragColor;

void main() 
{
    fragColor = vec4(color, 1);
}