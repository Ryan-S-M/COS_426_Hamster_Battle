import {Vector3} from 'three';
export function handleKeyDown(event, scene) {
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
}