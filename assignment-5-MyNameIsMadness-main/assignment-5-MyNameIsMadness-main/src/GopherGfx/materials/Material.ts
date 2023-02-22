import { GraphicsApp } from '../core/GraphicsApp';
import { Mesh } from '../geometry/Mesh';
import { Camera } from '../core/Camera';
import { Transform } from '../core/Transform';
import { LightManager } from '../lights/LightManager';

export abstract class Material
{
    public visible: boolean;
    protected readonly gl: WebGL2RenderingContext;

    constructor()
    {
        this.visible = true;
        this.gl  = GraphicsApp.getInstance().renderer.gl;
    }

    abstract draw(mesh: Mesh, transform: Transform, camera: Camera, lightManager: LightManager) : void; 
}