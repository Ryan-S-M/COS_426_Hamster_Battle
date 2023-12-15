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
const scene = new SeedScene();
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
    if (state == 0) {
        renderer.render(startScene, camera);
    } else if (state == 1) {
        renderer.render(scene, camera);
        scene.update && scene.update(timeStamp);
    } else if (state == 2) {
        renderer.render(startScene, camera);
        //renderer.render(restart_page, camera);
    }
     
    window.requestAnimationFrame(onAnimationFrameHandler);

    // testing
    // camera.lookAt(scene.player.position);
    const offset = scene.player.direction.clone().multiplyScalar(-8).add(new Vector3(0, 5, 0));
    // camera.position.copy(scene.player.position.clone().add(new Vector3(0, 5, -8)))
    camera.position.copy(scene.player.position.clone().add(offset));
    camera.lookAt(scene.player.position);
    if (camera.position.y < -10) {
        state = 2;
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
window.addEventListener('keydown', event => handleKeyDown(event, scene), false);

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
        if (state == 0 || state == 2) {
            state = 1;
        }
    }
}