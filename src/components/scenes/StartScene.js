import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { Scene, Color } from 'three';

class StartScene extends Scene {
    constructor() {
        super();
        const loader = new FontLoader();
        this.background = new Color(0x1ec9ee);
        loader.load('fonts/helvetiker_regular.typeface.json', function (font) {

            const geometry = new TextGeometry( 'Hello three.js!', {
                font: font,
                size: 80,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
                bevelOffset: 0,
                bevelSegments: 5
            } );
            
        } );
    }
}
export default StartScene;