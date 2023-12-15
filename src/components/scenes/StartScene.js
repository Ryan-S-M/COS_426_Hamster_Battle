import { Scene, Color } from 'three';

class StartScene extends Scene {
    constructor(num) {
        super();
        this.background = new Color(0xaababf);
        
        var thing = document.getElementsByClassName("dg ac")[0];
        thing.style = "padding-left: 15px"

        thing.innerHTML += '<div class="instructions" style="height:60px"></div>'
        thing.innerHTML += '<div class="instructions" style="font-size: 40px">welcome to the hamster battle</div>'
        thing.innerHTML += '<div class="instructions" style="height:40px"></div>'
        thing.innerHTML += '<div class="instructions" style="font-size: 20px">w propels your hamster forward, a turns left, and d turns right.</div>'
        thing.innerHTML += '<div class="instructions" style="font-size: 20px">try to knock the other hamsters off the table without falling off yourself!</div>'
        thing.innerHTML += '<div class="instructions" style="height:60px"></div>'
        thing.innerHTML += '<div class="instructions" style="font-size: 30px">press the spacebar to begin</div>'

        thing.innerHTML += '<div hidden class="restart" style="height:60px"></div>'
        thing.innerHTML += '<div hidden class="restart" style="font-size: 40px; color: red">YOU DIED :(</div>'
        thing.innerHTML += '<div hidden class="restart" style="height:40px"></div>'
        thing.innerHTML += '<div hidden class="restart" style="font-size: 20px">w propels your hamster forward, a turns left, and d turns right.</div>'
        thing.innerHTML += '<div hidden class="restart" style="font-size: 20px">try to knock the other hamsters off the table without falling off yourself!</div>'
        thing.innerHTML += '<div hidden class="restart" style="height:60px"></div>'
        thing.innerHTML += '<div hidden class="restart" style="font-size: 30px">press the spacebar to play again</div>'
        
        
    }
}
export default StartScene;