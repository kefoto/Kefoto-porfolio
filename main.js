//make app.js into different files and the constructors
import { nav__expansion } from "./src/nav.js";
import { deviceType, isTouchDevice, events } from "./src/device.js";
import {
  container__collision,
  container_resize,
  drag__e_move,
  drag__e_up,
  classes
} from "./src/container_collision.js";
import { updateBottomDateCircle, presentDateCircle, repeatedString} from "./src/bottomCircle.js";
import { changeHoverletter } from "./src/letter.js";
import { arrow_interaction, arrow_move } from "./src/arrow.js";
import { mainloop, ball_up, ball_move, canvas_resize } from "./src/canvas.js";
import { logo_animation } from "./src/logo_animation.js";

let resizeTimeout;
export var isResizing = false;


//TODO: mobile performance issue, thottling 
//TODO: main screen, items falling with circle touching the black circle that expands
//TODO: a loading screen
//TODO: drag me on the main page
//TODO: arrow. set not hover based on mobile
//TODO: set up email list
//TODO: from left and right to up and down
isTouchDevice();


//loading
document.addEventListener("DOMContentLoaded", (event) => {

  
  gsap.registerPlugin(ScrollTrigger);

  //making all the content invisible.
  for(let x in classes){
    document.getElementById(classes[x]).style.visibility = "hidden";
  }
  // gsap code here!
 });


// console.log(deviceType);
nav__expansion();
var temp = new Date();
const dateString =`TODAY'S DATE: ${
  temp.getMonth() + 1
}/${temp.getDate()}/${temp.getFullYear()} `;

presentDateCircle(
 repeatedString(dateString,3)
);
document_listener();
window_listener();

container__collision();

requestAnimationFrame(mainloop);

arrow_interaction();
changeHoverletter();
if(deviceType =="mouse"){
  // console.log("yep");
  logo_animation();
}


// ensure only one listener exist
function window_listener() {
  window.addEventListener(
    "resize",
    () => {
        
        if (!isResizing){
            isResizing = true;
        //     console.log(position_percentage);
        }
      
      container_resize();
      canvas_resize();
        
      clearTimeout(resizeTimeout);

      // Set a new timeout to detect the end of resizing
      resizeTimeout = setTimeout(() => {
        isResizing = false;
      }, 100);
    },
    true
  );
}

function document_listener() {

  //to stop the ball moving when the mouse leaves the browser
  document.addEventListener(
    events[deviceType].up,
    () => {

      drag__e_up();
      ball_up();
      //TODO: same applies to the physics balls
    },
    true
  );

  document.addEventListener(
    events[deviceType].move,
    (e) => {
      // if(isTouchDevice()){
      //   e.preventDefault();
      // }
      // console.log("yep");
      drag__e_move(e);
      // ball_move(e);
      arrow_move(e);
    },
    true
  );
}

//TODO: put document and window even listeners in the main method
// console.log(deviceType);
