import { Group, Vector3, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './hamster.glb';

class Hamster extends Group {
    constructor(parent, scale, x, y, z) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'hamster';
        this.state = {
            run: true,
            mixer: null,
            animations: [],
            moving: 0
        }
        this.prevTime = 0;

        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            this.model = model;
            model.scale.set(scale, scale, scale);
            model.position.copy(new Vector3(x, y, z));
            let fileAnimations = gltf.animations;
            let mixer = new AnimationMixer(model);
            this.state.mixer = mixer;
            this.add(model);
            
            for (const anim of fileAnimations) {
                let playing = mixer.clipAction(anim);
                this.state.animations.push(playing);
                playing.play()
            }
        });
        
        parent.addToUpdateList(this);
    }
    
    update(timeStamp) {
        if (this.state.mixer && this.state.moving < 50) {
            this.state.mixer.update(timeStamp - this.prevTime);
            this.state.moving += 1;
        }
        this.prevTime = timeStamp;
    }
}

export default Hamster;
