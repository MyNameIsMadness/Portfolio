// CSCI 4611 Assignment 5: Artistic Rendering
// You only need to modify the shaders for this assignment.
// You do not need to write any TypeScript code unless
// you are planning to add wizard functionality.

import * as gfx from './GopherGfx/GopherGfx'

export class EdgeMesh extends gfx.Mesh
{
    public leftNormalBuffer: WebGLBuffer | null;
    public rightNormalBuffer: WebGLBuffer | null;

    private edgeMap: Map<string, number>;

    constructor()
    {
        super();

        this.leftNormalBuffer = this.gl.createBuffer();
        this.rightNormalBuffer = this.gl.createBuffer();

        this.edgeMap = new Map<string, number>();
    }

    createFromMesh(mesh: gfx.Mesh): void
    {
        this.edgeMap.clear();

        // Load mesh data from GPU memory
        const vArray = mesh.getVertices();
        const nArray = mesh.getNormals();
        const iArray = mesh.getIndices();

        // Move into more convenient data structures
        const meshVertices: gfx.Vector3[] = [];
        const meshNormals: gfx.Vector3[] = [];
        const meshFaces: gfx.Vector3[] = [];
        for(let i=0; i < mesh.vertexCount; i++)
        {
            meshVertices.push(new gfx.Vector3(vArray[i*3], vArray[i*3+1], vArray[i*3+2]));
            meshNormals.push(new gfx.Vector3(nArray[i*3], nArray[i*3+1], nArray[i*3+2]));
        }
        for(let i=0; i < mesh.triangleCount; i++)
        {
            meshFaces.push(new gfx.Vector3(iArray[i*3], iArray[i*3+1], iArray[i*3+2]));
        }

        const vertices: gfx.Vector3[] = [];
        const normals: gfx.Vector3[] = [];
        const leftNormals: gfx.Vector3[] = [];
        const rightNormals: gfx.Vector3[] = [];
        const triangles: gfx.Vector3[] = [];
        for(let i=0; i < mesh.triangleCount; i++)
        {
            const edge1 = gfx.Vector3.subtract(meshVertices[meshFaces[i].y], meshVertices[meshFaces[i].x]);
            const edge2 = gfx.Vector3.subtract(meshVertices[meshFaces[i].z], meshVertices[meshFaces[i].x]);
            edge1.normalize();
            edge2.normalize();
            const faceNormal = gfx.Vector3.cross(edge1, edge2);

            this.addEdge(vertices, normals, leftNormals, rightNormals, triangles, meshVertices, meshNormals, 
                meshFaces[i].x, meshFaces[i].y, faceNormal);
            this.addEdge(vertices, normals, leftNormals, rightNormals, triangles, meshVertices, meshNormals, 
                meshFaces[i].y, meshFaces[i].z, faceNormal);
            this.addEdge(vertices, normals, leftNormals, rightNormals, triangles, meshVertices, meshNormals, 
                meshFaces[i].z, meshFaces[i].x, faceNormal);
        }
        
        this.setVertices(vertices);
        this.setNormals(normals);
        this.setArrayBuffer(leftNormals, this.leftNormalBuffer);
        this.setArrayBuffer(rightNormals, this.rightNormalBuffer);
        this.setIndices(triangles);
    }

    private addEdge(vertices: gfx.Vector3[], 
                    normals: gfx.Vector3[], 
                    leftNormals: gfx.Vector3[], 
                    rightNormals: gfx.Vector3[],
                    triangles: gfx.Vector3[],
                    meshVertices: gfx.Vector3[],
                    meshNormals: gfx.Vector3[],
                    v1: number,
                    v2: number, 
                    n: gfx.Vector3): void
    {
        // Swap order so that v1 is always lower
        let pair: string;
        if(v1 < v2)
            pair = [v1, v2].join(',');
        else
            pair = [v2, v1].join(',');

        const vertex = this.edgeMap.get(pair);
        if(vertex)
        {
            rightNormals[vertex] = n;
            rightNormals[vertex+1] = n;
            rightNormals[vertex+2] = n;
            rightNormals[vertex+3] = n;
        }
        else
        {
            const newVertex = vertices.length;
            this.edgeMap.set(pair, newVertex);

            vertices.push(meshVertices[v1]);
            vertices.push(meshVertices[v1]);
            vertices.push(meshVertices[v2]);
            vertices.push(meshVertices[v2]);

            normals.push(gfx.Vector3.ZERO);
            normals.push(meshNormals[v1]);
            normals.push(gfx.Vector3.ZERO);
            normals.push(meshNormals[v2]);

            leftNormals.push(n);
            leftNormals.push(n);
            leftNormals.push(n);
            leftNormals.push(n);

            const nInverse =  gfx.Vector3.multiplyScalar(n, -1);
            rightNormals.push(nInverse);
            rightNormals.push(nInverse);
            rightNormals.push(nInverse);
            rightNormals.push(nInverse);

            triangles.push(new gfx.Vector3(newVertex, newVertex+2, newVertex+3));
            triangles.push(new gfx.Vector3(newVertex, newVertex+3, newVertex+1));
        }
    }
}