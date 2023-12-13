import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './hamster.glb';

class Hamster extends Group {
    constructor(scale, x, y, z) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'hamster';

        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            this.model = model;
            model.scale.set(scale, scale, scale);
            model.position.copy(new Vector3(x, y, z));
            this.add(model);
        });
    }
}

export default Hamster;
