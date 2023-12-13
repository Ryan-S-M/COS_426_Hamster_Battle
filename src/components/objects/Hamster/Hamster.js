import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './hamster.glb';

class Hamster extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'hamster';

        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.4, 0.4, 0.4);
            model.position.y = .8;
            this.add(model);
        });
    }
}

export default Hamster;
