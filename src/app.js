/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene, StartScene } from 'scenes';

// Initialize core ThreeJS components
const camera = new PerspectiveCamera();
let playScene = new SeedScene();
const startScene = new StartScene();
//const restartScene = new RestartScene();
const renderer = new WebGLRenderer({ antialias: true });

let state = 0;

// Set up camera
camera.position.set(0, 5, -8);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 16;
// controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    if (state == 0 || state == 2) {
        renderer.render(startScene, camera);
    } else if (state == 1) {
        renderer.render(playScene, camera);
        playScene.update && playScene.update(timeStamp);
    } 
     
    window.requestAnimationFrame(onAnimationFrameHandler);

    // testing
    // camera.lookAt(playScene.player.position);
    const offset = playScene.player.direction.clone().multiplyScalar(-8).add(new Vector3(0, 5, 0));
    // camera.position.copy(playScene.player.position.clone().add(new Vector3(0, 5, -8)))
    camera.position.copy(playScene.player.position.clone().add(offset));
    camera.lookAt(playScene.player.position);
    if (camera.position.y < -10) {
        state = 2;
        
        let restart = document.getElementsByClassName("restart");
        for (const elem of restart) {
            elem.hidden = false;
        }
        
        //console.log("about to despawn a hamster, number of NPCS is ", this.controller.NPCSpheres.length);
        let sphereList = playScene.state.sphereList;
        for (let i = 0; i < playScene.controller.NPCSpheres.length; i++) {
            let sphere = playScene.controller.NPCSpheres[i];
            playScene.controller.NPCSpheres.splice(i, 1);
            const sphereIndex = sphereList.indexOf(sphere);
            sphereList.splice(sphereIndex, 1);
            playScene.remove(sphere);
            sphere.geometry.dispose();
            sphere.material.dispose();
            console.log("despawned a hamster, number of NPCS is ", playScene.controller.NPCSpheres.length);
            console.log("total number of spheres is ", sphereList.length);
        }
        
        // playScene.level = 1;
        // playScene.numNPCSpawn = 1;
        // playScene.NPCWeight = 0.5;
        // playScene.NPCPower = 1;
    }

};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
window.addEventListener('keydown', event => handleKeyDown(event, playScene), false);

function handleKeyDown(event, scene) {
    if (event.key == "a") {
        scene.player.turnLeft();
        // console.log("turning Left");
        const axis = new Vector3(scene.player.position.x, 1, scene.player.position.z);

        // scene.rotateOnAxis(axis, - Math.PI / 10.0);
    }
    if (event.key == "d") {
        scene.player.turnRight();
        // console.log("turning right");
        const axis = new Vector3(scene.player.position.x, 1, scene.player.position.z);

        // scene.rotateOnAxis(axis, Math.PI / 10.0);

    }
    if (event.key == "w") {
        scene.player.goForward();
        // console.log("going forward");
    }
    if (event.key == " ") {
        if (state == 0) {
            state = 1;
            let instructions = document.getElementsByClassName("instructions");
            for (const elem of instructions) {
                elem.hidden = true;
            }
        } else if (state == 2) {
            playScene.reset();
            state = 1
            let restart = document.getElementsByClassName("restart");
            for (const elem of restart) {
                elem.hidden = true;
            }
        }
        
    }
}