import * as THREE from 'three'
import { Skeleton } from './Skeleton'
import { MotionClip } from './MotionClip'
import { Pose } from './Pose';
import { Bone } from './Bone';
import { Color, MeshNormalMaterial, NoToneMapping } from 'three';

export class AnimatedCharacter extends THREE.Object3D
{
    public skeleton: Skeleton;
    public fps: number;
    public useAbsolutePosition: boolean;
    
    private clip: MotionClip | null;
    
    private currentTime: number;
    private currentPose: Pose;
    
    private overlayQueue: MotionClip[];
    private overlayTransitionFrames: number[];
    private overlayTime: number;
    private overlayPose: Pose;

    constructor(fps = 60, useAbsolutePosition = true)
    {
        super();
        
        this.skeleton = new Skeleton(this);
        this.fps = fps;
        this.useAbsolutePosition = useAbsolutePosition;

        this.clip = null;

        this.currentTime = 0;
        this.currentPose = new Pose();
        
        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;  
        this.overlayPose = new Pose();
    }

    createMeshes(showAxes: boolean): void
    {
        // Here is a good way to check your work -- draw the coordinate axes for each
        // bone.  To start, this will just draw the axes for the root node of the
        // character, but once you add this to createMeshesRecursive, you can
        // draw the axes for each bone.
        if(showAxes)
        {
            this.skeleton.rootTransform.add(new THREE.AxesHelper(0.15));
        }

        this.skeleton.rootBones.forEach((rootBone: Bone) => {
            this.createMeshesRecursive(rootBone, showAxes)
        });
    }

    private createMeshesRecursive(bone: Bone, showAxes: boolean): void
    {
        if(showAxes) { bone.transform.add(new THREE.AxesHelper(0.15)); }
        var frame = false;

        // TO DO: Draw the bone so that the character will be diplayed as a stick figure
        // You will want to create a thin box mesh that is the length of the bone
        // and then orient it so that it is pointing in the correct direction

        // TO DO: Eventually, you'll want to draw something different depending on which part
        // of the body is being drawn.  An if statement like this is an easy way to do that.
        // You can find the names of additional bones in the .asf files.
        if(bone.name == 'head')
        {
            const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const material = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.translateY(0.05);
            bone.transform.add(mesh);

            const noseGeometry = new THREE.ConeGeometry(0.02, 0.06, 16);
            const yellowMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: frame } );
            const noseMesh = new THREE.Mesh(noseGeometry, yellowMaterial);
            noseMesh.translateZ(.105);
            bone.transform.add(noseMesh);

            const haloGeometry = new THREE.TorusGeometry(0.07, 0.015, 16, 16);
            const haloMesh = new THREE.Mesh(haloGeometry, yellowMaterial);
            haloMesh.translateY(0.25);
            haloMesh.rotateX(90 * Math.PI / 180);
            bone.transform.add(haloMesh);

            const eyeGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.01, 16, 16);
            const eyeMesh1 = new THREE.Mesh(eyeGeometry, yellowMaterial);
            var eye1 = new THREE.Matrix4().makeTranslation(0.06, 0.08, 0.1);
            eyeMesh1.applyMatrix4(eye1);
            eyeMesh1.rotateX(90 * Math.PI / 180);
            bone.transform.add(eyeMesh1);

            const eyeMesh2 = new THREE.Mesh(eyeGeometry, yellowMaterial);
            var eye2 = new THREE.Matrix4().makeTranslation(-0.06, 0.08, 0.1);
            eyeMesh2.applyMatrix4(eye2);
            eyeMesh2.rotateX(90 * Math.PI / 180);
            bone.transform.add(eyeMesh2);

            const earGeometry = new THREE.OctahedronGeometry(0.035, 0);
            const earMesh1 = new THREE.Mesh(earGeometry, yellowMaterial);
            var ear1 = new THREE.Matrix4().makeTranslation(0.1, 0.05, 0);
            earMesh1.applyMatrix4(ear1);
            bone.transform.add(earMesh1);

            const earMesh2 = new THREE.Mesh(earGeometry, yellowMaterial);
            var ear2 = new THREE.Matrix4().makeTranslation(-0.1, 0.05, 0);
            earMesh2.applyMatrix4(ear2);
            bone.transform.add(earMesh2);
        }
        else if(bone.name == 'upperneck') 
        {
            const geometry = new THREE.SphereGeometry(0.075, 16, 16);
            const material = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            mesh.translateZ(0.05);
            bone.transform.add(mesh);
        }
        else if(bone.name == 'lowerneck') 
        {
            const geometry = new THREE.BoxGeometry(0.05, 0.05, bone.length + 0.15);
            const material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            bone.transform.add(mesh);
        }
        else if(bone.name == 'thorax') 
        {
            const geometry = new THREE.SphereGeometry(0.075, 16, 16);
            const material = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            bone.transform.add(mesh);
        }
        else if(bone.name == 'upperback')
        {
            const geometry = new THREE.BoxGeometry(0.075, 0.075, bone.length + 0.1);
            const material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            bone.transform.add(mesh);
        }
        else if(bone.name == 'lowerback')
        {
            const geometry = new THREE.SphereGeometry(0.12, 16, 16);
            const material = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            mesh.translateZ(-0.05);
            bone.transform.add(mesh);
        }
        else if(bone.name == "lhipjoint" || bone.name == 'rhipjoint')
        {
            const geometry = new THREE.SphereGeometry(0.12, 16, 16);
            const material = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            bone.transform.add(mesh);
        }
        else if(bone.name == "lfemur" || bone.name == 'rfemur')
        {
            const geometry = new THREE.BoxGeometry(0.05, 0.05, bone.length - 0.07);
            const material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            mesh.translateZ(-0.2);
            bone.transform.add(mesh);

            const kneeGeometry = new THREE.SphereGeometry(0.075, 16, 16);
            const kneeMaterial = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: frame } );
            const kneeMesh = new THREE.Mesh(kneeGeometry, kneeMaterial);
            kneeMesh.lookAt(bone.direction);
            bone.transform.add(kneeMesh);
        }    
        else if(bone.name == "ltibia" || bone.name == 'rtibia')
        {
            const geometry = new THREE.BoxGeometry(0.05, 0.05, bone.length);
            const material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            mesh.translateZ(-0.2);
            bone.transform.add(mesh);
        }  
        else if(bone.name == "lfoot" || bone.name == 'rfoot')
        {
            const geometry = new THREE.BoxGeometry(0.05, 0.05, bone.length + 0.08);
            const material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            bone.transform.add(mesh);

            const ankleGeometry = new THREE.SphereGeometry(0.075, 16, 16);
            const ankleMaterial = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: frame } );
            const ankleMesh = new THREE.Mesh(ankleGeometry, ankleMaterial);
            ankleMesh.lookAt(bone.direction);
            ankleMesh.translateZ(-0.1);
            ankleMesh.translateY(0.01);
            bone.transform.add(ankleMesh);
        }    
        // else if(bone.name == "ltoes" || bone.name == 'rtoes')
        // {
        //     const geometry = new THREE.BoxGeometry(0.05, 0.05, bone.length + 0.08);
        //     const material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: frame } );
        //     const mesh = new THREE.Mesh(geometry, material);
        //     mesh.lookAt(bone.direction);
        //     bone.transform.add(mesh);
        // }  
        else if(bone.name == "lclavicle" || bone.name == 'rclavicle')
        {
            const shoulderGeometry = new THREE.SphereGeometry(0.05, 16, 16);
            const shoulderMaterial = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: frame } );
            const shoulderMesh = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
            shoulderMesh.lookAt(bone.direction);
            bone.transform.add(shoulderMesh);

            const geometry = new THREE.BoxGeometry(0.05, 0.05, bone.length - 0.035);
            const material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            if(bone.name == "lclavicle") {
                var arm1 = new THREE.Matrix4().makeTranslation(-0.08, -0.015, -0.015);
                mesh.applyMatrix4(arm1);
            } else {
                var arm2 = new THREE.Matrix4().makeTranslation(0.08, -0.015, -0.015);
                mesh.applyMatrix4(arm2);
            }
            mesh.lookAt(bone.direction);
            bone.transform.add(mesh);
        }  
        else if(bone.name == "lhumerus" || bone.name == 'rhumerus')
        {
            const geometry = new THREE.BoxGeometry(0.05, 0.05, bone.length);
            const material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            mesh.translateZ(-0.15);
            bone.transform.add(mesh);

            const elbowGeometry = new THREE.SphereGeometry(0.05, 16, 16);
            const elbowMaterial = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: frame } );
            const elbowMesh = new THREE.Mesh(elbowGeometry, elbowMaterial);
            elbowMesh.lookAt(bone.direction);
            bone.transform.add(elbowMesh);
        } 
        else if(bone.name == "lwrist" || bone.name == 'rwrist')
        {
            const geometry = new THREE.SphereGeometry(0.05, 16, 16);
            const material = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            bone.transform.add(mesh);
        } 
        // else if(bone.name == "lhand" || bone.name == 'rhand')
        // {
        //     const geometry = new THREE.BoxGeometry(0.01, 0.01, bone.length);
        //     const material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: frame } );
        //     const mesh = new THREE.Mesh(geometry, material);
        //     mesh.lookAt(bone.direction);
        //     bone.transform.add(mesh);
        // } 
        else if(bone.name == "lfingers" || bone.name == 'rfingers' || bone.name == 'lthumb' || bone.name == 'rthumb')
        {
            const geometry = new THREE.BoxGeometry(0.012, 0.012, bone.length + 0.03);
            const material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            bone.transform.add(mesh);
        } 
        else if(bone.name == "lradius" || bone.name == 'rradius')
        {
            const geometry = new THREE.BoxGeometry(0.05, 0.05, bone.length + 0.07);
            const material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: frame } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.lookAt(bone.direction);
            mesh.translateZ(-0.08);
            bone.transform.add(mesh);
        } 

        // TO DO: Recursively this function for each of the bone's children
        bone.children.forEach((child: Bone) => {
            this.createMeshesRecursive(child, showAxes);
        });
    }

    loadSkeleton(filename: string): void
    {
        this.skeleton.loadFromASF(filename);
    }

    loadMotionClip(filename: string): MotionClip
    {
        const clip = new MotionClip();
        clip.loadFromAMC(filename, this.skeleton);
        return clip;
    }

    play(clip: MotionClip): void
    {
        this.stop();
        this.clip = clip;
        this.currentPose = this.clip.frames[0];
    }

    stop(): void
    {
        this.clip = null;
        this.currentTime = 0;

        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;
    }

    overlay(clip: MotionClip, transitionFrames: number): void
    {
        this.overlayQueue.push(clip);
        this.overlayTransitionFrames.push(transitionFrames);
    }

    update(deltaTime: number): void
    {
        // If the motion queue is empty, then do nothing
        if(!this.clip)
            return;

        // Advance the time
        this.currentTime += deltaTime;

        // Set the next frame number
        let currentFrame = Math.floor(this.currentTime * this.fps);

        if(currentFrame >= this.clip.frames.length)
        {
            currentFrame = 0;
            this.currentTime = 0;   
            this.currentPose = this.clip.frames[0];
        }

        let overlayFrame = 0;

        // Advance the overlay clip if there is one
        if(this.overlayQueue.length > 0)
        {
            this.overlayTime += deltaTime;

            overlayFrame = Math.floor(this.overlayTime * this.fps);

            if(overlayFrame >= this.overlayQueue[0].frames.length)
            {
                this.overlayQueue.shift();
                this.overlayTransitionFrames.shift();
                this.overlayTime = 0;
                overlayFrame = 0;
            }
        }

        const pose = this.computePose(currentFrame, overlayFrame);
        this.skeleton.update(pose, this.useAbsolutePosition);
    }

    public getQueueCount(): number
    {
        return this.overlayQueue.length;
    }

    private computePose(currentFrame: number, overlayFrame: number): Pose
    {
        // If there is an active overlay track
        if(this.overlayQueue.length > 0)
        {
            // Start out with the unmodified overlay pose
            const overlayPose = this.overlayQueue[0].frames[overlayFrame].clone();

            let alpha = 0;

            // Fade in the overlay
            if(overlayFrame < this.overlayTransitionFrames[0])
            {
                alpha = 1 - overlayFrame / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }
            // Fade out the overlay
            else if (overlayFrame > this.overlayQueue[0].frames.length - this.overlayTransitionFrames[0])
            {
                alpha = 1 - (this.overlayQueue[0].frames.length - overlayFrame) / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }

            if(!this.useAbsolutePosition)
            {
                const relativeOverlayPosition = this.overlayQueue[0].frames[overlayFrame].getRootPosition();
                relativeOverlayPosition.sub(this.overlayPose.getRootPosition());

                const relativePosition = this.clip!.frames[currentFrame].getRootPosition();
                relativePosition.sub(this.currentPose.getRootPosition());

                relativeOverlayPosition.lerpVectors(relativeOverlayPosition, relativePosition, alpha);
                this.position.add(relativeOverlayPosition);

                this.overlayPose = this.overlayQueue[0].frames[overlayFrame];
                this.currentPose = this.clip!.frames[currentFrame];
            }
            
            return overlayPose;
        }
        // Motion is entirely from the base track
        else
        {
            if(!this.useAbsolutePosition)
            {
                const relativePosition = this.clip!.frames[currentFrame].getRootPosition();
                relativePosition.sub(this.currentPose.getRootPosition());
                this.position.add(relativePosition);
                this.currentPose = this.clip!.frames[currentFrame];
            }

            return this.clip!.frames[currentFrame];
        }
    }
}