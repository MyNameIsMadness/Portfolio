#version 300 es

// CSCI 4611 Assignment 5: Artistic Rendering
// You should modify this fragment shader to implement per-pixel illumination.
// The code will be similar to the per-vertex illumination shading
// implemented in GopherGfx/shaders/gouraud.vert.

precision mediump float;

#define POINT_LIGHT 0
#define DIRECTIONAL_LIGHT 1

const int MAX_LIGHTS = 16;

uniform vec3 kAmbient;
uniform vec3 kDiffuse;
uniform vec3 kSpecular;
uniform float shininess;

uniform int numLights;
uniform int lightTypes[MAX_LIGHTS];
uniform vec3 lightPositions[MAX_LIGHTS];
uniform vec3 ambientIntensities[MAX_LIGHTS];
uniform vec3 diffuseIntensities[MAX_LIGHTS];
uniform vec3 specularIntensities[MAX_LIGHTS];
uniform vec3 eyePosition;

in vec3 vertPosition;
in vec3 vertNormal;
in vec4 vertColor;

out vec4 fragColor;

void main() 
{
    vec3 illumination = vec3(0, 0, 0);
    for(int i=0; i < numLights; i++)
    {
        // Ambient component
        illumination += kAmbient * ambientIntensities[i];

        vec3 n = normalize(vertNormal);

        vec3 l;
        if(lightTypes[i] == DIRECTIONAL_LIGHT) l = normalize(lightPositions[i]);
        else l = normalize(lightPositions[i] - vertPosition);

        // Diffuse component
        float diffuseComponent = max(dot(n, l), 0.0);
        illumination += diffuseComponent * kDiffuse * diffuseIntensities[i];

        vec3 e = normalize(eyePosition - vertPosition);
        vec3 r = reflect(-l, n);

        // Specular component
        float specularComponent = pow(max(dot(e, r), 0.0), shininess);
        illumination += specularComponent * kSpecular * specularIntensities[i];
    }

    fragColor = vertColor;
    fragColor.rgb *= illumination;
}