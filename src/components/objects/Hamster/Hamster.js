import { Group, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './hamster.glb';

class Hamster extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'hamster';
        this.state = {
            run: true,
            mixer: null
        }

        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            let fileAnimations = gltf.animations;
            model.scale.set(0.4, 0.4, 0.4);
            model.position.y = .8;
            let mixer = new AnimationMixer(model);
            this.state.mixer = mixer;
            this.add(model);
            
            console.log(fileAnimations);
            for (const anim of fileAnimations) {
                let playing = mixer.clipAction(anim);
                playing.play();
            }
        });
        
        parent.addToUpdateList(this);
    }
    
    update(timeStamp) {
        if (this.state.mixer) {
            this.state.mixer.update(timeStamp);
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Hamster;
