import { Group, BoxGeometry, Mesh, MeshPhongMaterial} from 'three';

class Cube extends Group {
    constructor(parent) {
        super();

        this.name = 'cube';
        
        // taken from example in https://threejs.org/docs/#api/en/objects/Group
        const geometry = new BoxGeometry( 1, 1, 1 );
        const material = new MeshPhongMaterial( {color: 0x00ff00, transparent: true, opacity:0.25} );
        
        // const cubeA = new THREE.Mesh( geometry, material );
        this.add(new Mesh(geometry, material));

        parent.addToUpdateList(this);
    }
    update(timeStamp) {
        // this.position.x = (timeStamp / 1000) % 2;
        // this.position.y = (- timeStamp / 1000) % 2
    }
}

export default Cube;