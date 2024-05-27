import { deviceType, events, isTouchDevice} from "./device.js";
import { mainloop } from "./canvas.js";
import { updateBottomDateCircle } from "./bottomCircle.js";
import {isResizing} from "../main.js";
import { photo_expansion_add,photo_expansion_remove } from "./scroll.js";

// const spinning = document.querySelector(".spin");
const arrowLink = document.getElementById("arrowLink");

const physicCircleContainer__ele = document.getElementById(
  "physicCircleContainer"
);

export const drag__e = document.getElementById("drag__e");
export const nav__bar = document.querySelector(".navbar");
export const button__menu = document.querySelectorAll(".button__menu");

var offset = [0, 0];
var mousePosition;

export const playground__container = document.getElementById("container");
export var outDim = {
  left: playground__container.offsetLeft,
  top: playground__container.offsetTop - nav__bar.offsetHeight,
  right: playground__container.offsetLeft + playground__container.offsetWidth,
  bottom:
    playground__container.offsetTop +
    playground__container.offsetHeight -
    nav__bar.offsetHeight,
};

export var moving = false;
export var isRendering = false;

var position_percentage = { x: (drag__e.offsetLeft) / (outDim.right),
  y:
    (drag__e.offsetTop) /
    (outDim.bottom),
};

var p = null;

let button__menu__size = button__menu.clientHeight;

export const classes = {
  abt: "about",
  dta: "data",
  fto: "foto",
  ptr: "poster",
};

export var collision__circle = {
  abt: false,
  dta: false,
  fto: false,
  ptr: false,
};

export const translate_const = {
  abt: {x: "-25%", y:"-25%"},
  dta: {x:"25%", y:"-25%"},
  fto: {x:"-25%", y:"25%"},
  ptr: {x:"25%", y:"25%"}
}

var origin = [
  playground__container.offsetWidth / 2,
  playground__container.offsetHeight / 2,
];


export const container__collision = () => {
  drag__e.addEventListener(
    events[deviceType].down,
    function (e) {
      moving = true;
      if(!isTouchDevice()){
        offset = [drag__e.offsetLeft - e.clientX, drag__e.offsetTop - e.clientY];
      } else {
        offset = [drag__e.offsetLeft - e.touches[0].clientX, drag__e.offsetTop - e.touches[0].clientY];
      }
      
    },
    true
  );

  drag__e.addEventListener(events[deviceType].up, () => {
    drag__e_up();
  });

  //TODO: window change when goes full screen
};

//for document event listener
export const drag__e_up = () => {
  moving = false;

  if (drag__e.offsetLeft != origin[0] && drag__e.offsetTop != origin[1]) {
    origin__reset__promise(4000);
  }
};

export const drag__e_move = (event) => {
  if (moving) {
    //change position and check on boundary collision
    mousePosition = {
      x: !isTouchDevice() ? event.clientX : event.touches[0].clientX,
      y: !isTouchDevice() ? event.clientY : event.touches[0].clientY,
    };
    

    //mouse allowed area but not the border collision
    var x_allowed =
      mousePosition.x > outDim.left + drag__e.offsetWidth / 2 &&
      mousePosition.x <= outDim.right - drag__e.offsetWidth / 2;
    var y_allowed =
      mousePosition.y >
        outDim.top + nav__bar.offsetHeight / 2 + drag__e.offsetHeight &&
      mousePosition.y <=
        outDim.bottom + nav__bar.offsetHeight - drag__e.offsetHeight / 2;
    //   debugger;

    // console.log(mousePosition, offset);
    if (x_allowed) {
      // styleChanges.left = mousePosition.x + offset[0] + "px";
      drag__e.style.left = mousePosition.x + offset[0] + "px";
    } else {
      if (mousePosition.x >= outDim.left + drag__e.offsetWidth / 2) {
        // styleChanges.left = outDim.right - drag__e.offsetWidth / 2 + "px";
        drag__e.style.left = outDim.right - drag__e.offsetWidth / 2 + "px";
      }
      if (mousePosition.x <= outDim.right - drag__e.offsetWidth / 2) {
        // styleChanges.left = outDim.left + drag__e.offsetWidth / 2 + "px";
        drag__e.style.left = outDim.left + drag__e.offsetWidth / 2 + "px";
      }
    }
    //   debugger;
    if (y_allowed) {
      // styleChanges.top = mousePosition.y + offset[1] + "px";
      drag__e.style.top = mousePosition.y + offset[1] + "px";
    } else {
      if (
        mousePosition.y >=
        outDim.top + nav__bar.offsetHeight / 2 + drag__e.offsetHeight
      ) {
        // styleChanges.top = outDim.bottom - drag__e.offsetHeight / 2 + "px";
        drag__e.style.top = outDim.bottom - drag__e.offsetHeight / 2 + "px";
      }
      if (
        mousePosition.y <=
        outDim.bottom + nav__bar.offsetHeight - drag__e.offsetHeight / 2
      ) {
        // styleChanges.top = outDim.top + drag__e.offsetHeight / 2 + "px";
        drag__e.style.top = outDim.top + drag__e.offsetHeight / 2 + "px";
      }
    }

    // requestAnimationFrame(() => {
    //   Object.assign(drag__e.style, styleChanges);
    //   styleChanges = {}; // Clear the style changes object
    // });
    // debugger;
    // console.log(mousePosition);
    other_buttons_opacity();
    buttons__collision();
    update_pos_percent();
    // console.log(position_percentage);
  }
};
//window resize event listener
export const container_resize = () => {
  //   debugger;
  // console.log(isResizing);
  // console.log(position_percentage);
  //TODO: playground__container dimension froze 

  outDim.left = playground__container.offsetLeft;
  outDim.top = playground__container.offsetTop - nav__bar.offsetHeight;
  outDim.right =
    playground__container.offsetLeft + playground__container.offsetWidth;
  outDim.bottom =
    playground__container.offsetTop +
    playground__container.offsetHeight -
    nav__bar.offsetHeight;

  console.log(outDim.right, outDim.bottom);
  origin = [
    playground__container.offsetWidth / 2,
    playground__container.offsetHeight / 2,
  ];

    drag__e.style.top =
    position_percentage.y *
      (outDim.bottom)  + 
    "px";
    drag__e.style.left =
    position_percentage.x * (outDim.right) + "px";
    

  //since the cursor would onnly go outofbound in right or bottom
  //and we posiiton based on the percentage of the board, 
  //it's impossible to go off bound with no transitions

  other_buttons_opacity();
  // updateBottomDateCircle();
  buttons__collision();

  if (drag__e.offsetLeft != origin[0] && drag__e.offsetTop != origin[1] && getKeysByValue(collision__circle, true).length == 1) {
    origin__reset__promise(1000);
  }

  

  
};

function update_pos_percent() {
  position_percentage.x = round((drag__e.offsetLeft) / (outDim.right),2);
  position_percentage.y = round((drag__e.offsetTop) /
  (outDim.bottom), 2);
}

function other_buttons_opacity() {
  const position__map = {
    abt: "left",
    dta: "right",
    fto: "left",
    ptr: "right",
  };

  if (getKeysByValue(collision__circle, true).length == 1) {
    const otherButtons = Array.from(getKeysByValue(collision__circle, false));

    otherButtons.forEach((b) => {
      const temp = position__map[b];
      // if (temp == "left") {
      //   // check_n_update_style(document.getElementById(b), temp, "-300px");
      //   document.getElementById(b).style[temp] = "-300px";
      // } else if (temp == "right") {
      //   // check_n_update_style(document.getElementById(b), temp, "-300px");
      //   document.getElementById(b).style[temp] = "-300px";
      // }

      gsap.to(`#${b}`, { [temp]: "-300px", duration: 0.5, opacity: 0.2, ease: "power1.out"});

      // check_n_update_style(document.getElementById(b), temp, "0.2");
      // document.getElementById(b).style.opacity = "0.2";
    });

    // console.log(otherButtons);
  } else if (getKeysByValue(collision__circle, true).length == 0) {
    const otherButtons = Array.from(getKeysByValue(collision__circle, false));

    otherButtons.forEach((b) => {
      const temp = position__map[b];
      //  check_n_update_style(document.getElementById(b), temp, "0");
      //  check_n_update_style(document.getElementById(b), "opacity", "1");
      gsap.to(`#${b}`, { [temp]: "0", duration: 0.5, opacity: 1, ease: "power1.out"});
      // document.getElementById(b).style.opacity = "1";
    });

  }
}

//TODO: bug whem the window goes full screen / vertical window change
//TODO: nav expansion color change is buggy
//TODO: change visibility only when visibility is not the same
//TODO:  change style only when the style is not the same

function buttons__collision() {
  //   debugger;
  button__menu.forEach((b) => {
    var elementId = b.id;
    
    const button__menu_array = Array.from(button__menu);
    const otherButtons = button__menu_array.filter((item) => item !== b);

    // if(isCircleCollide(drag__e, b)){
    //   collision__circle[elementId] = true;
    // }
    //if something is colliding
    if (isCircleCollide(drag__e, b)) {
      collision__circle[elementId] = true;
      if (getKeysByValue(collision__circle, true).length >= 2) {
        collision__circle[elementId] = false;
        return;
      }
      // console.log(elementId);
      //to change the disciptions
      // document.getElementById(classes[elementId]).style.transition =
      //   "opacity 0.3s ease-out";
      // document.getElementById(classes[elementId]).style.top = "50%";

      // check_n_update_style(document.getElementById(classes[elementId]), "opacity", "1");
      // check_n_update_style(document.getElementById(classes[elementId]), "visibility", "visible");
      gsap.set(`#${classes[elementId]}`, { visibility: "visible", opacity: 0 });
      gsap.to(`#${classes[elementId]}`, { opacity: 1, visibility: "visible", duration: 0.5 }, 0.5);
      b.style.backgroundColor = "#242424";
  

      let href;
      //Changing style
      //TODO: CHANGE arrowLink
      if (b.id == "abt") {

        arrowLink.href = "https://www.linkedin.com/in/kefoto/";
       

      } else if (b.id == "dta") {

        arrowLink.href = "https://github.com/kefoto/";

        isRendering = true;
        physicCircleContainer__ele.style.opacity = "1";
        physicCircleContainer__ele.style.visibility = "visible";
        requestAnimationFrame(mainloop);

      } else if (b.id == "fto") {
        gsap.set('#foto-float', {clipPath: 'circle(0%)', opacity: 0});
        gsap.to('#foto-float', {clipPath: 'circle(100%)', opacity: 1, duration: 0.6, delay: 0.7,ease: "power3.out", overwrite:'true'});
        arrowLink.href = "foto-blog.html";
      
        // photo_expansion_add();
        
      } else {
        gsap.set('#ptr-float', {clipPath: 'circle(0%)', opacity: 0});
        gsap.to('#ptr-float', {clipPath: 'circle(100%)', opacity: 1, duration: 0.6, delay: 0.7, ease: "power3.out", overwrite:'true'});
        arrowLink.href = "https://example.com/collision4";
      }
      console.log(b.id);
      // check_n_update_style(b, "transform", "scale(0.4) " + temptranslate);
      gsap.to("#" + b.id, {
        scale: 0.4,
        duration: 0.5,
        x: translate_const[b.id].x,
        y: translate_const[b.id].y,
        ease: "power1.out",
        // onComplete: function() {
        //   // Code to execute after the transformation is complete
          
        // }
      }).then(() =>{
        updateBottomDateCircle();
      });


      
    //if nothign collide
    } else {
      // console.log(elementId + "not colliding");

      b.style.backgroundColor = "transparent";
      b.style.width = button__menu__size + "px";
      b.style.height = button__menu__size + "px";
      gsap.to("#" + b.id, {
        scale: 1,
        duration: 0.5,
        x: 0,
        y: 0,
        ease: "power1.out",
        // onComplete: function() {
        //   // Code to execute after the transformation is complete
        //   updateBottomDateCircle();
        // }
      }).then(() =>{
        updateBottomDateCircle();
      });

  

      //make sure it only execute once
      if (b.id == "dta") {
        isRendering = false;
        // check_n_update_style(canvas__ele, "visibility", "hidden");
        // check_n_update_style(physicCircleContainer__ele, "visibility", "hidden");
        // check_n_update_style(physicCircleContainer__ele, "opacity", "0");
        // canvas__ele.style.visibility = "hidden";
        physicCircleContainer__ele.style.visibility = "hidden";
        physicCircleContainer__ele.style.opacity = "0";
      } else if(b.id == "fto"){
        //TODO: when this condition happens, the animation glitches
        gsap.set('#foto-float', {clipPath: 'circle(100%)', opacity: 1});
        gsap.to('#foto-float', {clipPath: 'circle(0%)', opacity: 0, duration: 0.2, ease: "power1.out"});
        // photo_expansion_remove();
      } else if(b.id == "ptr") {
        gsap.set('#ptr-float', {clipPath: 'circle(100%)', opacity: 1});
        gsap.to('#ptr-float', {clipPath: 'circle(0%)', opacity: 0, duration: 0.2, ease: "power1.out"});
      }

      gsap.to(`#${classes[elementId]}`, { opacity: 0, visibility: "hidden", duration: 0.5}, 0.5);
      // document.getElementById(classes[elementId]).style.visibility = "hidden";
      // document.getElementById(classes[elementId]).style.opacity = "0";
      collision__circle[elementId] = false;

      
    }
  });
}

function isCircleCollide(x, y) {
  if (
    getDistance(
      x.offsetLeft,
      x.offsetTop,
      y.offsetLeft + y.offsetWidth / 2,
      y.offsetTop + y.offsetHeight / 2
    ) <
    x.offsetWidth / 2 + y.offsetWidth / 2
  ) {
    return true;
  } else {
    return false;
  }
}

function origin__reset__promise(x) {
  if (!p) {
    p = new Promise(function (resolve, reject) {
      setTimeout(() => {
        if (getKeysByValue(collision__circle, true).length == 0 && !moving && !isResizing) {
          // check_n_update_style(drag__e, "transition", "all 0.4s ease-in-out");
          // check_n_update_style(drag__e, "left", origin[0] + "px");
          // check_n_update_style(drag__e, "top", origin[1] + "px");
          drag__e.style.transition = "all 0.4s ease-in-out";
          drag__e.style.left = origin[0] + "px";
          drag__e.style.top = origin[1] + "px";
          // console.log("origin");

          drag__e.addEventListener("transitionend", function transitionEndCallback() {
            drag__e.removeEventListener("transitionend", transitionEndCallback);
            
            update_pos_percent();
            // check_n_update_style(drag__e, "transition", "none");
            drag__e.style.transition = "none";
            console.log(position_percentage, drag__e.offsetLeft, outDim.right);
            resolve();

          });
          
        } else if (
          getKeysByValue(collision__circle, true).length == 1 &&
          !moving && !isResizing
        ) {
          const temp = getKeysByValue(collision__circle, true);
          const circle_container = document.getElementById(temp);
          const rect = circle_container.getBoundingClientRect();

          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2 - nav__bar.offsetHeight;

          // check_n_update_style(drag__e, "transition", "all 0.4s ease-in-out");
          // check_n_update_style(drag__e, "left", centerX + "px");
          // check_n_update_style(drag__e, "top", centerY + "px");
          drag__e.style.transition = "all 0.4s ease-in-out";
          drag__e.style.left = centerX + "px";
          drag__e.style.top = centerY + "px";
          // console.log("collision");
          drag__e.addEventListener("transitionend", function transitionEndCallback() {
            drag__e.removeEventListener("transitionend", transitionEndCallback);
            
            update_pos_percent();
            drag__e.style.transition = "none";
            // console.log(position_percentage, drag__e.offsetLeft, outDim.right);
            resolve();

          });
        }   
        p = null;
      }, x);
    });
    return p;
  }
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export const getKeysByValue = (object, value) => {
  return Object.keys(object).filter((key) => object[key] === value);
};

function round(number, precision){
  let factor = 10 ** precision;
  return Math.round(number * factor)/ factor;
}