import {HamsterSphere} from 'objects';
import {Vector3} from 'three';
import {SeedScene} from '../scenes/SeedScene';

class HamsterController {
    /**
     * @param {!HamsterSphere} playerSphere
     * @param {!Array<!HamsterSphere>} NPCSpheres
     * @param {number} difficulty
     * @param {!SeedScene} scene
     */
    constructor(playerSphere, NPCSpheres, box) {
        this.playerSphere = playerSphere;
        this.NPCSpheres = NPCSpheres;
        let box_params = {
            l: box.geometry.parameters.depth,
            w: box.geometry.parameters.width,
            h: box.geometry.parameters.height
        };
        this.boundaries = {
            x_min: -box_params.w / 2,
            x_max: box_params.w / 2,
            z_min: -box_params.l / 2,
            z_max: box_params.l / 2
        }
    }

    /**
     * Tell the sphere which way to move 
     * @param {HamsterSphere} hs 
     */
    getDirection(hs) {
        if (hs == this.playerSphere) {
            return null;
        }
        // check if near edge
        let EPS = 1;
        let near_edge = false;
        if (hs.position.x < this.boundaries.x_min + EPS ||
            hs.position.x > this.boundaries.x_max - EPS ||
            hs.position.z < this.boundaries.z_min + EPS ||
            hs.position.z > this.boundaries.z_max - EPS) {
            near_edge = true;
        }


        const x_min = this.boundaries.x_min;
        const x_max = this.boundaries.x_max;
        const z_min = this.boundaries.z_min;
        const z_max = this.boundaries.z_max;

        if (hs.NPCTarget == null) {
            hs.NPCNumFrames += 1;
            if (hs.NPCNumFrames >= 200) {
                // get new random position
                if (hs.NPCRandomness > Math.random()) {
                    hs.NPCTarget = new Vector3(
                        (x_min + Math.random() * (x_max - x_min)) * 0.75,
                        hs.position.y,
                        (z_min + Math.random() * (z_max - z_min)) * 0.75);
                }
                else {
                    hs.NPCNumFrames = 0;
                }
            }
        }
        else if (hs.position.clone().sub(hs.NPCTarget).length() < hs.radius) {
            if (hs.NPCRandomness < Math.random()) {
                hs.NPCTarget = null;
                hs.NPCNumFrames = 0;
            }
            else {
                hs.NPCTarget = new Vector3(
                    (x_min + Math.random() * (x_max - x_min)) * 0.75,
                    hs.position.y,
                    (z_min + Math.random() * (z_max - z_min)) * 0.75);
            }
        } 

        // new goal: point on the player sphere opposite the closest corner
        let aimTowards;
        if (hs.NPCTarget == null) {
            const playerRadius = this.playerSphere.radius;
            const playerPos = this.playerSphere.position.clone();
            // playerPos.y = 0;
            const edgePoint1 = new Vector3(playerPos.x, playerPos.y, z_min);
            const edgePoint2 = new Vector3(playerPos.x, playerPos.y, z_max);
            const edgePoint3 = new Vector3(x_min, playerPos.y, playerPos.z);
            const edgePoint4 = new Vector3(x_max, playerPos.y, playerPos.z);

            const dist1 = playerPos.clone().sub(edgePoint1).lengthSq();
            const dist2 = playerPos.clone().sub(edgePoint2).lengthSq();
            const dist3 = playerPos.clone().sub(edgePoint3).lengthSq();
            const dist4 = playerPos.clone().sub(edgePoint4).lengthSq();
            const minDist = Math.min(dist1, dist2, dist3, dist4);
            let oppDir;
            if (dist1 == minDist) {
                oppDir = playerPos.clone().sub(edgePoint1).normalize();
            }
            else if (dist2 == minDist) {
                oppDir = playerPos.clone().sub(edgePoint2).normalize();
            }
            else if (dist3 == minDist) {
                oppDir = playerPos.clone().sub(edgePoint3).normalize();
            }
            else {
                oppDir = playerPos.clone().sub(edgePoint4).normalize();
            }
            aimTowards = playerPos.clone().add(oppDir.clone().multiplyScalar(playerRadius));
            
            
            aimTowards.y = this.playerSphere.position.y;
        }
        else {
            if (!near_edge) {
                aimTowards = hs.NPCTarget;
            }
            else {
                aimTowards = new Vector3(0, hs.position.y, 0);
            }
        }

        let vec_btw_centers = aimTowards.clone().sub(hs.position);
        let best_direction = new Vector3(vec_btw_centers.x, 0, vec_btw_centers.z);
        let angle = hs.direction.angleTo(best_direction);
        // take cross product to determine direction
        let crossValY = hs.direction.clone().cross(vec_btw_centers).y;

        

        let best_choice;
        if (near_edge) {
            if (crossValY > 0) {
                best_choice = "left";
            } else {
                best_choice = "right";
            }
        }
        if (Math.abs(angle) < Math.PI / 6) {
            best_choice = "forward";
        } else if (crossValY > 0) {
            best_choice = "left";
        } else {
            best_choice = "right";
        }

        if (!near_edge && Math.random() < 0.2) {
            return "nothing";
        } else {
            return best_choice;
        }
    }
}

export default HamsterController