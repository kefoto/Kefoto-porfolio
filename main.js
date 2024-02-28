//make app.js into different files and the constructors
import {nav__expansion} from './src/nav.js';
import {deviceType,isTouchDevice, events} from './src/device.js';
import {container__collision, container_resize, drag__e_move, drag__e_up} from './src/container_collision.js';
import {updateBottomDateCircle} from './src/bottomCircle.js';
import {changeHoverletter} from './src/letter.js'
import {arrow_interaction, arrow_move} from './src/arrow.js';
import {mainloop} from "./src/ball.js";

//TODO: check this method if changes the deviceType in device.js
isTouchDevice();
nav__expansion();
updateBottomDateCircle();
container__collision();
document_listener();
window_listener();

requestAnimationFrame(mainloop);

arrow_interaction();
changeHoverletter();



// ensure only one listener exist
function window_listener() {
    window.addEventListener(
        "resize",
        () => {
            container_resize();
        },
        true
      );
}

function document_listener() {

    // document.addEventListener{
    //     events[deviceType].down,
    //     () => {
        
    //     },
    // true
    // };

    //to stop the ball moving when the mouse leaves the browser
    document.addEventListener(
        events[deviceType].up,
        () => {
            drag__e_up();
        },
    true
    );

    document.addEventListener(
        events[deviceType].move,
        (e) => {
            drag__e_move(e);
            arrow_move(e);
        },
    true
    );

    
}


//TODO: put document and window even listeners in the main method
// console.log(deviceType);