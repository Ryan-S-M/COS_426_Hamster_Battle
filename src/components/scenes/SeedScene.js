import * as Dat from 'dat.gui';
import { Scene, Color, Vector3 } from 'three';
import { HamsterSphere, Box} from 'objects';
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
            sphereList: [],
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
        this.box = box;
        const playerSphere = new HamsterSphere(this, 1, 0, 0, 0, 1);
        playerSphere.changePos(new Vector3(3, 3, 0));
        playerSphere.setVel(new Vector3(-1, 2, 0));
        this.add(lights, box, playerSphere);

        // testing
        // const box2 = new Box(this, 2, 1, 2);
        // // box2.position.sub(new Vector3(1, 0, 0));
        // box2.updatePos(-2, 0, 0);
        // this.box2 = box2;
        // this.add(box2);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    addToSphereList(object) {
        this.state.sphereList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList, sphereList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;
        
        // make scene move up instead of rotation
        // this.rotation.y = 0;
        // this.position.x = (timeStamp / 5000.0) % 3;
        // this.position.y = (timeStamp / 5000.0) % 5;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
        for (const sphere of sphereList) {
            sphere.handleBoxCollision(this.box);
            // sphere.handleBoxCollision(this.box2);
        }
    }
}

export default SeedScene;
