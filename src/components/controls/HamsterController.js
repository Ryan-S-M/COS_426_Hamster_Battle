import { HamsterSphere } from 'objects';
import { Vector3 } from 'three';

class HamsterController {
    /**
     * @param {!HamsterSphere} playerSphere
     * @param {!Array<!HamsterSphere>} NPCSpheres
     * @param {number} difficulty
     */
    constructor(playerSphere, NPCSpheres, difficulty) {
        this.playerSphere = playerSphere;
        this.NPCSpheres = NPCSpheres;
        this.difficulty = difficulty;
    }

    /**
     * Tell the sphere which way to move 
     * @param {HamsterSphere} hs 
     */
    getDirection(hs) {
        if (hs.index == this.playerSphere.index) {
            return null;
        }
        let vec_btw_centers = this.playerSphere.position.clone().sub(hs.position);
        let best_direction = (new Vector3(vec_btw_centers.x, 0, vec_btw_centers.z)).normalize();
        

    }
}

export default HamsterController