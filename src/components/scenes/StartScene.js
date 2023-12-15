import { Scene, Color } from 'three';

class StartScene extends Scene {
    constructor() {
        super();
        this.background = new Color(0xaababf);
       
        var thing = document.getElementsByClassName("dg ac")[0];

        var string = '<div style="padding-left: 15px"><div class="instructions" style="height:60px"></div>'
        string += '<div class="instructions" style="font-size: 40px">welcome to the hamster battle</div>'
        string += '<div class="instructions" style="height:40px"></div>'
        string += '<div class="instructions" style="font-size: 20px">w propels your hamster forward, a turns left, and d turns right.</div>'
        string += '<div class="instructions" style="font-size: 20px">try to knock the other hamsters off the table without falling off yourself!</div>'
        string += '<div class="instructions" style="height:60px"></div>'
        string += '<div class="instructions" style="font-size: 30px">press the spacebar to begin</div>'

        string += '<div hidden class="restart" style="height:60px"></div>'
        string += '<div hidden class="restart" style="font-size: 40px; color: red">YOU DIED :(</div>'
        string += '<div hidden class="restart" style="height:40px"></div>'
        string += '<div hidden class="restart" style="font-size: 20px">w propels your hamster forward, a turns left, and d turns right.</div>'
        string += '<div hidden class="restart" style="font-size: 20px">try to knock the other hamsters off the table without falling off yourself!</div>'
        string += '<div hidden class="restart" style="height:60px"></div>'
        string += '<div hidden class="restart" style="font-size: 30px">press the spacebar to play again</div></div>'
        thing.innerHTML = string;
        
    }
}
export default StartScene;