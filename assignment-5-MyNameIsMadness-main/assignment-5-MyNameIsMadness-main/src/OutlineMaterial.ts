// CSCI 4611 Assignment 5: Artistic Rendering
// You only need to modify the shaders for this assignment.
// You do not need to write any TypeScript code unless
// you are planning to add wizard functionality.

// @ts-ignore
import outlineVertexShader from './shaders/outline.vert'
// @ts-ignore
import outlineFragmentShader from './shaders/outline.frag'

import * as gfx from './GopherGfx/GopherGfx'
import { EdgeMesh } from './EdgeMesh';

export class OutlineMaterial extends gfx.Material
{
    public color: gfx.Color3;
    public thickness: number;

    private static shader = new gfx.ShaderProgram(outlineVertexShader, outlineFragmentShader);

    private modelViewUniform: WebGLUniformLocation | null;
    private projectionUniform : WebGLUniformLocation | null;
    private normalUniform: WebGLUniformLocation | null;

    private colorUniform: WebGLUniformLocation | null;
    private thicknessUniform : WebGLUniformLocation | null;

    private positionAttribute: number;
    private normalAttribute: number;
    private leftNormalAttribute: number;
    private rightNormalAttribute: number;

    constructor()
    {
        super();

        this.thickness = 0.01;
        this.color = new gfx.Color3(0, 0, 0);

        OutlineMaterial.shader.initialize(this.gl);

        this.modelViewUniform = OutlineMaterial.shader.getUniform(this.gl, 'modelViewMatrix');
        this.projectionUniform = OutlineMaterial.shader.getUniform(this.gl, 'projectionMatrix');
        this.normalUniform = OutlineMaterial.shader.getUniform(this.gl, 'normalMatrix')

        this.colorUniform = OutlineMaterial.shader.getUniform(this.gl, 'color');
        this.thicknessUniform = OutlineMaterial.shader.getUniform(this.gl, 'thickness');

        this.positionAttribute = OutlineMaterial.shader.getAttribute(this.gl, 'position');
        this.normalAttribute = OutlineMaterial.shader.getAttribute(this.gl, 'normal');
        this.leftNormalAttribute = OutlineMaterial.shader.getAttribute(this.gl, 'leftNormal');
        this.rightNormalAttribute = OutlineMaterial.shader.getAttribute(this.gl, 'rightNormal');
    }

    draw(mesh: gfx.Mesh, transform: gfx.Transform, camera: gfx.Camera, lightManager: gfx.LightManager): void
    {
        if(!this.visible || !(mesh instanceof EdgeMesh) || mesh.triangleCount == 0)
            return;

        const edgeMesh = mesh as EdgeMesh;

        // Switch to this shader
        this.gl.useProgram(OutlineMaterial.shader.getProgram());

        // Set the camera uniforms
        const modelViewMatrix = gfx.Matrix4.multiply(transform.getWorldMatrix(), camera.getViewMatrix());
        this.gl.uniformMatrix4fv(this.modelViewUniform, false, modelViewMatrix.mat);
        this.gl.uniformMatrix4fv(this.projectionUniform, false, camera.projectionMatrix.mat);
        this.gl.uniformMatrix4fv(this.normalUniform, false, modelViewMatrix.inverse().transpose().mat);

        // Set the outline properties uniforms
        this.gl.uniform3f(this.colorUniform, this.color.r, this.color.g, this.color.b);
        this.gl.uniform1f(this.thicknessUniform, this.thickness);

        // Set the vertex positions
        this.gl.enableVertexAttribArray(this.positionAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, edgeMesh.positionBuffer);
        this.gl.vertexAttribPointer(this.positionAttribute, 3, this.gl.FLOAT, false, 0, 0);

        // Set the vertex normals
        this.gl.enableVertexAttribArray(this.normalAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, edgeMesh.normalBuffer);
        this.gl.vertexAttribPointer(this.normalAttribute, 3, this.gl.FLOAT, false, 0, 0);

        // // Set the left normals
        this.gl.enableVertexAttribArray(this.leftNormalAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, edgeMesh.leftNormalBuffer);
        this.gl.vertexAttribPointer(this.leftNormalAttribute, 3, this.gl.FLOAT, false, 0, 0);

        // // Set the right normals
        this.gl.enableVertexAttribArray(this.rightNormalAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, edgeMesh.rightNormalBuffer);
        this.gl.vertexAttribPointer(this.rightNormalAttribute, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.disable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
        this.gl.polygonOffset(1, 1);
        
        // Draw the triangles
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, edgeMesh.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, edgeMesh.triangleCount*3, this.gl.UNSIGNED_SHORT, 0);

        this.gl.disable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
    }
}