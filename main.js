//make app.js into different files and the constructors
import {nav__expansion} from './src/nav.js';
import {container__collision} from './src/container_collision.js';
import {updateBottomDateCircle} from './src/bottomCircle.js';
import {changeHoverletter} from './src/letter.js'
import {arrow_interaction} from './src/arrow.js';
import {mainloop} from "./src/ball.js";

nav__expansion();
updateBottomDateCircle();
container__collision();

requestAnimationFrame(mainloop);

arrow_interaction();
changeHoverletter();



// console.log(deviceType);