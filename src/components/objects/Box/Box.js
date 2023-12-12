import { Group, BoxGeometry, Mesh, MeshPhongMaterial, Vector3} from 'three';

class Box extends Group {
    constructor(parent, length, width, height) {
        super();

        this.name = 'box';
        
        // taken from example in https://threejs.org/docs/#api/en/objects/Group
        this.geometry = new BoxGeometry( length, height, width);
        const material = new MeshPhongMaterial( {color: 0x333333} );
        
        // const cubeA = new THREE.Mesh( geometry, material );
        this.add(new Mesh(this.geometry, material));

        parent.addToUpdateList(this);
        this.geometry.computeBoundingBox();
        // console.log("bounding box: ", this.boundingBox);
    }
    update(timeStamp) {
        // this.position.x = (timeStamp / 1000) % 2;
        // this.position.y = (- timeStamp / 1000) % 2
    }

    // return whether this box is touching this sphere
    isTouchingSphere(pos, radius) {
        const boundingBox = this.geometry.boundingBox.clone();
        const EPS = 0.01;
        boundingBox.expandByVector(new Vector3(2 * EPS, 2 * EPS, 2 * EPS));
        const closestPointInBox = boundingBox.max.clone().min(boundingBox.min.clone().max(pos));
        const dist = closestPointInBox.clone().sub(pos).lengthSq();
        const realBoundingBox = this.geometry.boundingBox.clone();
        const realClosest = realBoundingBox.max.clone().min(realBoundingBox.min.clone().max(pos))
        // console.log("pos: ", pos);
        // console.log("closest: ", closestPointInBox);
        // console.log("dist: ", dist);
        // console.log("diff should be ", pos.clone().sub(closestPointInBox));
        return [dist < radius * radius, pos.clone().sub(realClosest)];
    }
    // update position
    updatePos(x, y, z) {
        console.log("box position before setting: ", this.position)
        console.log("bounding box before updating: ", this.geometry.boundingBox);
        this.position.copy(new Vector3(x, y, z));
        // console.log("hi");
        this.geometry.computeBoundingBox();
        // console.log("bye");
        // this.geometry.computeBoundingBox();
        console.log("bounding box: ", this.geometry.boundingBox);
        console.log("position after setting: ", this.position);
    }

}

export default Box;