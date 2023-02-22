#version 300 es

// CSCI 4611 Assignment 5: Artistic Rendering
// You should modify this fragment shader to implement a toon shading model
// As a starting point, you should copy and paste your completed shader code 
// from phong.frag into this file, and then modify it to use the diffuse
// and specular ramps. 

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

uniform sampler2D diffuseRamp;
uniform sampler2D specularRamp;

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

        float ndotl = dot(n, l);
        

        // Diffuse component
        float dxcoord = 0.5 * ndotl + 0.5;
        vec2 duv = vec2(dxcoord, 0.0);
        vec4 diffuseComponent = texture(diffuseRamp, duv);
        illumination += diffuseComponent.xyz * kDiffuse * diffuseIntensities[i];

        vec3 e = normalize(eyePosition - vertPosition);
        vec3 r = reflect(-l, n);

        // Specular component
        float sxcoord = pow(max(dot(e, r), 0.0), shininess);
        vec2 suv = vec2(sxcoord, 0.0);
        vec4 specularComponent = texture(specularRamp, suv);
        illumination += specularComponent.xyz * kSpecular * specularIntensities[i];
    }

    fragColor = vertColor;
    fragColor.rgb *= illumination;

}