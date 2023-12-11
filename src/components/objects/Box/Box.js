import { Group, BoxGeometry, Mesh, MeshPhongMaterial} from 'three';

class Box extends Group {
    constructor(parent, length, width, height) {
        super();

        this.name = 'box';
        
        // taken from example in https://threejs.org/docs/#api/en/objects/Group
        const geometry = new BoxGeometry( length, height, width);
        const material = new MeshPhongMaterial( {color: 0x333333} );
        
        // const cubeA = new THREE.Mesh( geometry, material );
        this.add(new Mesh(geometry, material));

        parent.addToUpdateList(this);
    }
    update(timeStamp) {
        // this.position.x = (timeStamp / 1000) % 2;
        // this.position.y = (- timeStamp / 1000) % 2
    }
}

export default Box;