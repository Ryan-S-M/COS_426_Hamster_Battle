import * as Dat from 'dat.gui';
import { Scene, Color, Vector3 } from 'three';
import { Hamster, Land, Cube, Flower, Box, HamsterSphere} from 'objects';
import { BasicLights } from 'lights';
import { HamsterController } from '../controls';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // this.camera = camera;
        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            sphereList: [],
        };

        // set level
        this.level = 1;
        this.numNPCSpawn = 1;
        this.NPCWeight = 0.5;
        this.NPCPower = 1;

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);
        // this.background = new Color(0xff0000);

        // Add meshes to scene
        //const land = new Land();
        //const flower = new Flower(this);
        const lights = new BasicLights();
        // const cube = new Cube(this);
        const box = new Box(this, 15, 15, 0.5);
        this.box = box;
        const playerSphere = new HamsterSphere(this, 1, 0, 0, 0, 2, 0xffee44);
        // playerSphere.changePos(new Vector3(3, 3, 3));
        playerSphere.changePos(new Vector3(0, 3, 0));
        playerSphere.setVel(new Vector3(0, 0, 0));
        playerSphere.setDirection(new Vector3(0, 0, 1));

        this.player = playerSphere;
        this.player.setPower(10);

        this.NPCColor = 0xff3344;

        const anotherSphere = new HamsterSphere(this, 1.15, 0, 0, 0, this.NPCWeight, this.NPCColor);
        anotherSphere.changePos(new Vector3(-3, 3, 0));
        anotherSphere.setVel(new Vector3(0, 0, 0));
        anotherSphere.setPower(this.NPCPower);
        // const sphere2 = new HamsterSphere(this, 1, 0, 0, 0, 1);
        // sphere2.changePos(new Vector3(0, 3, 3));
        // sphere2.setVel(new Vector3(0, 0, 0));
        // const sphere3 = new HamsterSphere(this, 1, 0, 0, 0, 5);
        // sphere3.changePos(new Vector3(0, 3, -3));
        // sphere3.setVel(new Vector3(0, 0, 0));
        // this.add(lights, box, playerSphere, anotherSphere, sphere2, sphere3);
        this.add(lights, box, playerSphere, anotherSphere);
        let NPCSpheres = []
        for (let sphere of this.state.sphereList) {
            if (sphere != playerSphere) {
                NPCSpheres.push(sphere);
            }
        }

        this.controller = new HamsterController(playerSphere, NPCSpheres, this.box);
        // this.add(lights, box, playerSphere)
        // testing
        // const box2 = new Box(this, 2, 1, 2);
        // // // box2.position.sub(new Vector3(1, 0, 0));
        // box2.updatePos(-2, 0, 0);
        // this.box2 = box2;
        // this.add(box2);
        // const player_hamster = new Hamster(0.4, 0, 0.8, 0);
        // this.add(player_hamster);
    

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

        // collide spheres with box
        for (const sphere of sphereList) {
            sphere.handleBoxCollision(this.box);
            // sphere.handleBoxCollision(this.box2);
        }


        for (let i = 0; i < this.controller.NPCSpheres.length; i++) {
            let sphere = this.controller.NPCSpheres[i];
            let dir = this.controller.getDirection(sphere);
            if (dir == "left") {
                sphere.turnLeft();
            } else if (dir == "right") {
                sphere.turnRight();
            } else if (dir == "forward") {
                sphere.goForward();
            }
            if (sphere.position.y < -10) {
                console.log("about to despawn a hamster, number of NPCS is ", this.controller.NPCSpheres.length);
                this.controller.NPCSpheres.splice(i, 1);
                const sphereIndex = sphereList.indexOf(sphere);
                sphereList.splice(sphereIndex, 1);
                this.remove(sphere);
                sphere.geometry.dispose();
                sphere.material.dispose();
                console.log("despawned a hamster, number of NPCS is ", this.controller.NPCSpheres.length);
                console.log("total number of spheres is ", sphereList.length);
                
                console.log("NPC number spawn: ", this.numNPCSpawn);
                console.log("NPC weight: ", this.NPCWeight);
                console.log("NPc Power: ", this.NPCPower);

            }
        }

        if (this.controller.NPCSpheres.length == 0) {
            // make the game harder
            this.level += 1;
            console.log("leveling up to: ", this.level);
            if (this.level % 3 == 0) {
                this.numNPCSpawn += 1;
            }
            else if (this.level % 3 == 1){
                this.NPCWeight += 0.5;
            }
            else {
                this.NPCPower += 0.5;
            }


            // minX =  - this.box.geometry.parameters.width / 3;
            const maxX = this.box.geometry.parameters.width / 3;
            // minZ = - this.box.geometry.parameters.depth / 3;
            const maxZ = this.box.geometry.parameters.depth / 3;



            for (let k = 1; k <= this.numNPCSpawn; k++) {
                const anotherSphere = new HamsterSphere(this, 1.15, 0, 0, 0, this.NPCWeight, this.NPCColor);
                const xCoord = Math.random() * maxX * 2 - maxX;
                const zCoord = Math.random() * maxZ * 2 - maxZ;
                anotherSphere.changePos(new Vector3(xCoord, 3 * k, zCoord));
                anotherSphere.setVel(new Vector3(0, 0, 0));
                anotherSphere.setPower(this.NPCPower);
                this.add(anotherSphere);
                this.controller.NPCSpheres.push(anotherSphere);
            }
        }


        // collide spheres with each other
        for (let i = 0; i < sphereList.length; i++) {
            for (let j = i + 1; j < sphereList.length; j++) {
                sphereList[i].collideBall(sphereList[j]);
            }
        }

        
        // console.log("scene position: ", this.position);
        // console.log("player position: ", this.player.position);
        // this.position.x = -this.player.position.x;
        // this.position.z = -this.player.position.z;    
        // this.camera.position.set(this.player.position.clone().add(new Vector3(0, 5, -8)));
        // this.camera.lookAt(this.camera.position);
    }
}

export default SeedScene;
