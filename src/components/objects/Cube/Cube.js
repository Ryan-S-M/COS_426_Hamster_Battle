import { Group, BoxGeometry, MeshBasicMaterial, Mesh} from 'three';

class Cube extends Group {
    constructor(parent) {
        super();

        this.name = 'cube';
        
        // taken from example in https://threejs.org/docs/#api/en/objects/Group
        const geometry = new BoxGeometry( 1, 1, 1 );
        const material = new MeshBasicMaterial( {color: 0x00ff00} );
        
        // const cubeA = new THREE.Mesh( geometry, material );
        this.add(new Mesh(geometry, material));

        // parent.addToUpdateList(this);
    }
}

export default Cube;