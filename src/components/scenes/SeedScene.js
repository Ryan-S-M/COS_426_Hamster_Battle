import * as Dat from 'dat.gui';
import { Scene, Color, Vector3 } from 'three';
import { Box, HamsterSphere} from 'objects';
import { BasicLights } from 'lights';
import { HamsterController } from '../controls';

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

        // set level
        this.level = 1;
        this.numNPCSpawn = 1;
        this.NPCWeight = 0.5;
        this.NPCPower = 1;
        this.NPCRadius = 1;

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const lights = new BasicLights();
        const box = new Box(this, 15, 15, 0.5);
        this.box = box;
        const playerSphere = new HamsterSphere(this, 1, 0, 0, 0, 4, 0xffee44, false);
        playerSphere.changePos(new Vector3(0, 3, 0));
        playerSphere.setVel(new Vector3(0, 0, 0));
        playerSphere.setDirection(new Vector3(0, 0, 1));

        this.player = playerSphere;
        this.player.setPower(50);

        this.NPCColor = 0xff3344;
        this.NPCRandomness = 0.9;

        const anotherSphere = new HamsterSphere(this, this.NPCRadius, 0, 0, 0, this.NPCWeight, this.NPCColor, true);
        anotherSphere.changePos(new Vector3(-3, 3, 0));
        anotherSphere.setVel(new Vector3(0, 0, 0));
        anotherSphere.setPower(this.NPCPower);
        anotherSphere.setRandomness(this.NPCRandomness);
        this.add(lights, box, playerSphere, anotherSphere);
        let NPCSpheres = []
        for (let sphere of this.state.sphereList) {
            if (sphere != playerSphere) {
                NPCSpheres.push(sphere);
            }
        }

        this.controller = new HamsterController(playerSphere, NPCSpheres, this.box);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    addToSphereList(object) {
        this.state.sphereList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList, sphereList } = this.state;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

        // collide spheres with box
        for (const sphere of sphereList) {
            sphere.handleBoxCollision(this.box);
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
                
                // make the game harder
                this.level += 1;
                console.log("leveling up to: ", this.level);
                
                console.log("NPC number spawn: ", this.numNPCSpawn);
                console.log("NPC weight: ", this.NPCWeight);
                console.log("NPc Power: ", this.NPCPower);
                console.log("NPC randomness: ", this.NPCRandomness)

            }
        }

        if (this.controller.NPCSpheres.length == 0) {
            this.numNPCSpawn += 1;
            if (this.numNPCSpawn % 3 == 1) {
                this.numNPCSpawn = 1;
                this.NPCWeight *= 1.1;
                this.NPCPower *= 1.5;
                this.NPCRandomness *= 0.8;
                this.NPCRadius *= 1.1;
                // get red component
                const rColor = this.NPCColor >>> 16;
                const bgColor = this.NPCColor & 0xffff;
                this.NPCColor = (bgColor << 8) + rColor;
                console.log("color: ", this.NPCColor.toString(16));
            }

            const maxX = this.box.geometry.parameters.width / 3;
            const maxZ = this.box.geometry.parameters.depth / 3;

            for (let k = 1; k <= this.numNPCSpawn; k++) {
                const anotherSphere = new HamsterSphere(this, this.NPCRadius, 0, 0, 0, this.NPCWeight, this.NPCColor, true);
                const xCoord = Math.random() * maxX * 2 - maxX;
                const zCoord = Math.random() * maxZ * 2 - maxZ;
                anotherSphere.changePos(new Vector3(xCoord, 3 * k, zCoord));
                anotherSphere.setVel(new Vector3(0, 0, 0));
                anotherSphere.setPower(this.NPCPower);
                anotherSphere.setRandomness(this.NPCRandomness);
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
    }
    
    reset() {
        this.level = 1;
        this.numNPCSpawn = 1;
        this.NPCWeight = 0.5;
        this.NPCPower = 1;
        this.NPCRandomness = 0.9;
        this.NPCColor = 0xff3344;
        this.NPCRadius = 1;

        const anotherSphere = new HamsterSphere(this, this.NPCRadius, 0, 0, 0, this.NPCWeight, this.NPCColor, true);
        anotherSphere.changePos(new Vector3(-3, 3, 0));
        anotherSphere.setVel(new Vector3(0, 0, 0));
        anotherSphere.setPower(this.NPCPower);
        anotherSphere.setRandomness(this.NPCRandomness);

        this.controller.NPCSpheres.push(anotherSphere);
        this.add(anotherSphere);

        this.player.changePos(new Vector3(0, 3, 0));
        this.player.setVel(new Vector3(0, 0, 0));
        this.player.setDirection(new Vector3(0, 0, 1));
        this.player.setPower(50);
        console.log(this.player.hamster.state.animations)
        console.log("done resetting");
        console.log("level: ", this.level);
    }
}

export default SeedScene;
