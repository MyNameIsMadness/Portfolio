// CSCI 4611 Assignment 5: Artistic Rendering
// You only need to modify the shaders for this assignment.
// You do not need to write any TypeScript code unless
// you are planning to add wizard functionality.

// @ts-ignore
import phongVertexShader from './shaders/phong.vert'
// @ts-ignore
import phongFragmentShader from './shaders/phong.frag'

import * as gfx from './GopherGfx/GopherGfx'

export class PhongMaterial extends gfx.Material
{
    public ambientColor: gfx.Color3;
    public diffuseColor: gfx.Color3;
    public specularColor: gfx.Color3;
    public shininess: number;

    private static shader = new gfx.ShaderProgram(phongVertexShader, phongFragmentShader);

    private kAmbientUniform: WebGLUniformLocation | null;
    private kDiffuseUniform: WebGLUniformLocation | null;
    private kSpecularUniform: WebGLUniformLocation | null;
    private shininessUniform: WebGLUniformLocation | null;

    private eyePositionUniform: WebGLUniformLocation | null;
    private modelUniform: WebGLUniformLocation | null;
    private viewUniform: WebGLUniformLocation | null;
    private projectionUniform : WebGLUniformLocation | null;
    private normalUniform: WebGLUniformLocation | null;

    private numLightsUniform: WebGLUniformLocation | null;
    private lightTypesUniform: WebGLUniformLocation | null;
    private lightPositionsUniform: WebGLUniformLocation | null;
    private ambientIntensitiesUniform: WebGLUniformLocation | null;
    private diffuseIntensitiesUniform: WebGLUniformLocation | null;
    private specularIntensitiesUniform: WebGLUniformLocation | null;

    private positionAttribute: number;
    private normalAttribute: number;
    private colorAttribute: number;

    constructor()
    {
        super();

        this.ambientColor = new gfx.Color3(1, 1, 1);
        this.diffuseColor = new gfx.Color3(1, 1, 1);
        this.specularColor = new gfx.Color3(0, 0, 0);
        this.shininess = 30;

        PhongMaterial.shader.initialize(this.gl);

        this.kAmbientUniform = PhongMaterial.shader.getUniform(this.gl, 'kAmbient');
        this.kDiffuseUniform = PhongMaterial.shader.getUniform(this.gl, 'kDiffuse');
        this.kSpecularUniform = PhongMaterial.shader.getUniform(this.gl, 'kSpecular');
        this.shininessUniform = PhongMaterial.shader.getUniform(this.gl, 'shininess');

        this.eyePositionUniform = PhongMaterial.shader.getUniform(this.gl, 'eyePosition');
        this.viewUniform = PhongMaterial.shader.getUniform(this.gl, 'viewMatrix');
        this.modelUniform = PhongMaterial.shader.getUniform(this.gl, 'modelMatrix');
        this.projectionUniform = PhongMaterial.shader.getUniform(this.gl, 'projectionMatrix');
        this.normalUniform = PhongMaterial.shader.getUniform(this.gl, 'normalMatrix')

        this.numLightsUniform = PhongMaterial.shader.getUniform(this.gl, 'numLights');
        this.lightTypesUniform = PhongMaterial.shader.getUniform(this.gl, 'lightTypes');
        this.lightPositionsUniform = PhongMaterial.shader.getUniform(this.gl, 'lightPositions');
        this.ambientIntensitiesUniform = PhongMaterial.shader.getUniform(this.gl, 'ambientIntensities');
        this.diffuseIntensitiesUniform = PhongMaterial.shader.getUniform(this.gl, 'diffuseIntensities');
        this.specularIntensitiesUniform = PhongMaterial.shader.getUniform(this.gl, 'specularIntensities');

        this.positionAttribute = PhongMaterial.shader.getAttribute(this.gl, 'position');
        this.normalAttribute = PhongMaterial.shader.getAttribute(this.gl, 'normal');
        this.colorAttribute = PhongMaterial.shader.getAttribute(this.gl, 'color');
    }

    draw(mesh: gfx.Mesh, transform: gfx.Transform, camera: gfx.Camera, lightManager: gfx.LightManager): void
    {
        if(!this.visible || mesh.triangleCount == 0)
            return;

        // Switch to this shader
        this.gl.useProgram(PhongMaterial.shader.getProgram());

        // Set the camera uniforms
        const cameraPosition = new gfx.Vector3();
        cameraPosition.applyMatrix(camera.getWorldMatrix());
        this.gl.uniform3f(this.eyePositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);
        this.gl.uniformMatrix4fv(this.modelUniform, false, transform.getWorldMatrix().mat);
        this.gl.uniformMatrix4fv(this.viewUniform, false, camera.getViewMatrix().mat);
        this.gl.uniformMatrix4fv(this.projectionUniform, false, camera.projectionMatrix.mat);
        this.gl.uniformMatrix4fv(this.normalUniform, false, transform.getWorldMatrix().inverse().transpose().mat);

        // Set the material property uniforms
        this.gl.uniform3f(this.kAmbientUniform, this.ambientColor.r, this.ambientColor.g, this.ambientColor.b);
        this.gl.uniform3f(this.kDiffuseUniform, this.diffuseColor.r, this.diffuseColor.g, this.diffuseColor.b);
        this.gl.uniform3f(this.kSpecularUniform,this.specularColor.r, this.specularColor.g, this.specularColor.b);
        this.gl.uniform1f(this.shininessUniform, this.shininess);

        // Set the light uniforms
        this.gl.uniform1i(this.numLightsUniform, lightManager.getNumLights());
        this.gl.uniform1iv(this.lightTypesUniform, lightManager.lightTypes);
        this.gl.uniform3fv(this.lightPositionsUniform, lightManager.lightPositions);
        this.gl.uniform3fv(this.ambientIntensitiesUniform, lightManager.ambientIntensities);
        this.gl.uniform3fv(this.diffuseIntensitiesUniform, lightManager.diffuseIntensities);
        this.gl.uniform3fv(this.specularIntensitiesUniform, lightManager.specularIntensities);

        // Set the vertex positions
        this.gl.enableVertexAttribArray(this.positionAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.positionBuffer);
        this.gl.vertexAttribPointer(this.positionAttribute, 3, this.gl.FLOAT, false, 0, 0);

        // Set the vertex normals
        this.gl.enableVertexAttribArray(this.normalAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.normalBuffer);
        this.gl.vertexAttribPointer(this.normalAttribute, 3, this.gl.FLOAT, false, 0, 0);

        // Set the vertex colors
        this.gl.enableVertexAttribArray(this.colorAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.colorBuffer);
        this.gl.vertexAttribPointer(this.colorAttribute, 4, this.gl.FLOAT, false, 0, 0);

        // Draw the triangles
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, mesh.triangleCount*3, this.gl.UNSIGNED_SHORT, 0);
    }
}