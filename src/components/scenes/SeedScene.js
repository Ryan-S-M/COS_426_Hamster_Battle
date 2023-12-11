import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Cube, Box} from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);
        // this.background = new Color(0xff0000);

        // Add meshes to scene
        // const land = new Land();
        // const flower = new Flower(this);
        const lights = new BasicLights();
        // const cube = new Cube(this);
        const box = new Box(this, 15, 15, 0.5);
        this.add(lights, box);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;
        
        // make scene move up instead of rotation
        // this.rotation.y = 0;
        // this.position.x = (timeStamp / 5000.0) % 3;
        // this.position.y = (timeStamp / 5000.0) % 5;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;