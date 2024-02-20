const menu = document.querySelector(".navbar__menu");
const menuLinks = document.querySelector(".navbar__toggle");
const buttons = document.querySelectorAll(".button");
const spinning = document.querySelector(".spin");
const bkg__color = "#242424";

//variable initiation for collision
let drag__e = document.getElementById("drag__e");
var offset = [0, 0];

var mousePosition;
let deviceType = "";
let nav__bar = document.querySelector(".navbar");
var playground__container = document.getElementById("container");
var outDim = {
  left: playground__container.offsetLeft,
  top: playground__container.offsetTop - nav__bar.offsetHeight,
  right: playground__container.offsetLeft + playground__container.offsetWidth,
  bottom:
    playground__container.offsetTop +
    playground__container.offsetHeight -
    nav__bar.offsetHeight,
};
var moving = false;

//for promise reset drag ui to origin if idle
var p = null;

const button__menu = document.querySelectorAll(".button__menu");
// let button__1 = document.getElementById("about");

//dragging event for collision
let events = {
  mouse: {
    down: "mousedown",
    move: "mousemove",
    up: "mouseup",
  },

  touch: {
    down: "touchstart",
    move: "touchmove",
    up: "touchend",
  },
};

let classes = {
  abt: "about",
  dta: "data",
  fto: "foto",
  ptr: "poster",
};

let collision__circle = {
  abt: false,
  dta: false,
  fto: false,
  ptr: false,
};
var origin = [
  playground__container.offsetWidth / 2,
  playground__container.offsetHeight / 2,
];

nav__expansion();
isTouchDevice();
updateBottomDateCircle();
container__collision();

const paragraphs = document.querySelectorAll(".hoverable-paragraph");
changeHoverletter();

// presentDateCircle();

//random color hover on button
function setBg(button) {
  setTimeout(function () {
    button.style.backgroundColor = bkg__color;
    button.style.color = "#fff";
  }, 3000);

  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  button.style.backgroundColor = "#" + randomColor;

  if (wc_hex_is_light(randomColor)) {
    button.style.color = "#242424";
  }
}

//whether a hexcode color is bright by average or no
function wc_hex_is_light(color) {
  const hex = color;
  const c_r = parseInt(hex.substring(0, 0 + 2), 16);
  const c_g = parseInt(hex.substring(2, 2 + 2), 16);
  const c_b = parseInt(hex.substring(4, 4 + 2), 16);
  const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
  return brightness > 155;
}

//small menu expansion
function nav__expansion() {
  menuLinks.addEventListener("click", function () {
    menu.classList.toggle("active");
    menuLinks.classList.toggle("is-active");
  });

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => setBg(button));
  });
}

// function normalize(val, min, max) {
//   return (val - min) / (max - min);
// }

function isTouchDevice() {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getKeysByValue(object, value) {
  return Object.keys(object).filter((key) => object[key] === value);
}

function hasExactlyOneTrue(hashTable) {
  let trueCount = 0;

  for (const key in hashTable) {
    if (hashTable[key] === true) {
      trueCount++;

      // If trueCount exceeds 1, no need to continue checking
      if (trueCount > 1) {
        return false;
      }
    }
  }

  return trueCount === 1;
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
        if (getKeysByValue(collision__circle, true).length == 0 && !moving) {
          drag__e.style.transition = "all 0.5s ease-in-out";
          drag__e.style.left = origin[0] + "px";
          drag__e.style.top = origin[1] + "px";
          resolve();
        }
        p = null;
      }, x);
    });

    return p;
  }
}

let button__menu__size = playground__container.clientHeight/2 - 15;

function buttons__collision() {
  //   debugger;
  button__menu.forEach((b) => {
    var elementId = b.id;
    // console.log(elementId);
    const button__menu_array = Array.from(button__menu);
    const otherButtons = button__menu_array.filter((item) => item !== b);

    if (isCircleCollide(drag__e, b)) {
      collision__circle[elementId] = true;
      if (getKeysByValue(collision__circle, true).length >= 2) {
        collision__circle[elementId] = false;
        return;
      }
      //to change the disciptions
      document.getElementById(classes[elementId]).style.top = "50%";
      document.getElementById(classes[elementId]).style.opacity = "1";
      b.style.backgroundColor = "#242424";
      console.log(b.id);
      
      // b.style.transformOrigin = "50% 50%";
      let temptranslate;

      if(b.id == "abt"){
        temptranslate = "translate(-50%, -50%)"
      } else if(b.id == "dta") {
        temptranslate = "translate(50%, -50%)"
      } else if(b.id == "fto") {
        temptranslate = "translate(-50%, 50%)"
      } else {
        temptranslate = "translate(50%, 50%)"
      }


      b.style.transform = "scale(0.4) " + temptranslate;
   


    } else {
      b.style.backgroundColor = "transparent";
      b.style.transformOrigin = "initial";
      // b.style.transform = "none";
      b.style.width = button__menu__size + "px";
      b.style.height = button__menu__size + "px";
      b.style.transform = "scale(1.0) translate(0%, 0%)";
      
      // console.log(b.clientWidth);
      document.getElementById(classes[elementId]).style.opacity = "0";
      document.getElementById(classes[elementId]).style.top = "-1000px";
      collision__circle[elementId] = false;

    }
  });
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
      if (temp == "left") {
        document.getElementById(b).style[temp] = "-300px";
      } else if (temp == "right") {
        document.getElementById(b).style[temp] = "-300px";
      }

      document.getElementById(b).style.opacity = "0.2";
    });

    // console.log(otherButtons);
  } else if (getKeysByValue(collision__circle, true).length == 0) {
    const otherButtons = Array.from(getKeysByValue(collision__circle, false));

    otherButtons.forEach((b) => {
      const temp = position__map[b];
      // console.log(b, getPositionValue(b, "opacity"));
      document.getElementById(b).style[temp] = "0";
      // if(getPositionValue(b, "opacity") == 0){
      // setTimeout(() => {
      document.getElementById(b).style.opacity = "1";
      // }, 200);
      // }
    });
  }
}

function getPositionValue(id, t) {
  const element = document.getElementById(`${id}`); // Replace with your actual element ID

  // Get the computed style for the element
  const computedStyle = window.getComputedStyle(element);

  // Retrieve the value of the 'top' property
  return computedStyle.getPropertyValue(`${t}`);
}

function container__collision() {
  drag__e.addEventListener(
    events[deviceType].down,
    function (e) {
      moving = true;
      offset = [drag__e.offsetLeft - e.clientX, drag__e.offsetTop - e.clientY];
      drag__e.style.transition = "none";
      //making the spinning drag me disappear
      spinning.style.opacity = "0";
      setTimeout(() => {
        spinning.style.top = "-1000px";
      }, 1020);
    },
    true
  );

  document.addEventListener(
    events[deviceType].up,
    function () {
      moving = false;
      // buttons__collision();
      if (
        getKeysByValue(collision__circle, true).length == 0 &&
        drag__e.offsetLeft != origin[0] &&
        drag__e.offsetTop != origin[1]
      ) {
        origin__reset__promise(4000);
      }
    },
    true
  );

  drag__e.addEventListener(events[deviceType].up, (e) => {
    moving = false;

    if (
      getKeysByValue(collision__circle, true).length == 0 &&
      drag__e.offsetLeft != origin[0] &&
      drag__e.offsetTop != origin[1]
    ) {
      origin__reset__promise(4000);
    }
  });

  document.addEventListener(
    events[deviceType].move,
    function (event) {
      // event.preventDefault();
      if (moving) {
        //change position and check on boundary collision
        mousePosition = {
          x: !isTouchDevice() ? event.clientX : event.touches[0].clientX,
          y: !isTouchDevice() ? event.clientY : event.touches[0].clientY,
        };

        var x_allowed =
          mousePosition.x > outDim.left + drag__e.offsetWidth / 2 &&
          mousePosition.x <= outDim.right - drag__e.offsetWidth / 2;
        var y_allowed =
          mousePosition.y >
            outDim.top + nav__bar.offsetHeight / 2 + drag__e.offsetHeight &&
          mousePosition.y <=
            outDim.bottom + nav__bar.offsetHeight - drag__e.offsetHeight / 2;
        //   debugger;
        if (x_allowed) {
          drag__e.style.left = mousePosition.x + offset[0] + "px";
        } else {
          if (mousePosition.x >= outDim.left + drag__e.offsetWidth / 2) {
            drag__e.style.left = outDim.right - drag__e.offsetWidth / 2 + "px";
          }
          if (mousePosition.x <= outDim.right - drag__e.offsetWidth / 2) {
            drag__e.style.left = outDim.left + drag__e.offsetWidth / 2 + "px";
          }
        }
        //   debugger;
        if (y_allowed) {
          drag__e.style.top = mousePosition.y + offset[1] + "px";
        } else {
          if (
            mousePosition.y >=
            outDim.top + nav__bar.offsetHeight / 2 + drag__e.offsetHeight
          ) {
            drag__e.style.top = outDim.bottom - drag__e.offsetHeight / 2 + "px";
          }
          if (
            mousePosition.y <=
            outDim.bottom + nav__bar.offsetHeight - drag__e.offsetHeight / 2
          ) {
            drag__e.style.top = outDim.top + drag__e.offsetHeight / 2 + "px";
          }
        }
        // debugger;
        other_buttons_opacity();
        updateBottomDateCircle();
        buttons__collision();
      }
    },
    true
  );

  //when the window change in size
  window.addEventListener(
    "resize",
    (e) => {
      //   debugger;
      outDim.left = playground__container.offsetLeft;
      outDim.top = playground__container.offsetTop - nav__bar.offsetHeight;
      outDim.right =
        playground__container.offsetLeft + playground__container.offsetWidth;
      outDim.bottom =
        playground__container.offsetTop +
        playground__container.offsetHeight -
        nav__bar.offsetHeight;

      origin = [
        playground__container.offsetWidth / 2,
        playground__container.offsetHeight / 2,
      ];

      if (
        getKeysByValue(collision__circle, true).length == 0 &&
        drag__e.offsetLeft != origin[0] &&
        drag__e.offsetTop != origin[1]
      ) {
        origin__reset__promise(500);
      }
      //since the cursor would onnly go outofbound in right or bottom, we put restrictions
      if (drag__e.offsetTop >= outDim.bottom - drag__e.offsetHeight / 2) {
        drag__e.style.top = outDim.bottom - drag__e.offsetHeight / 2 + "px";
      }

      if (drag__e.offsetLeft >= outDim.right - drag__e.offsetWidth / 2) {
        drag__e.style.left = outDim.right - drag__e.offsetWidth / 2 + "px";
        //   console.log("colide left", drag__e.offsetLeft, (outDim.left + drag__e.offsetWidth / 2));
      }
      other_buttons_opacity();
      updateBottomDateCircle();
      buttons__collision();
    },
    true
  );
}

function changeHoverletter() {
  paragraphs.forEach(function (paragraph) {
    var letters = paragraph.innerText.split("");

    paragraph.innerHTML = letters
      .map(function (letter) {
        return '<span class="hoverable-letter">' + letter + "</span>";
      })
      .join("");

    paragraph.querySelectorAll(".hoverable-letter").forEach(function (letter) {
      letter.addEventListener("mouseenter", function () {
        var randomStyleNumber = Math.floor(Math.random() * 4) + 1;

        if (randomStyleNumber == 1) {
          letter.style.fontFamily = "'Xanh Mono', monospace";
        } else if (randomStyleNumber == 2) {
          letter.style.fontFamily = "'Syne Mono', monospace";
        } else if (randomStyleNumber == 3) {
          letter.style.fontFamily = "'Silkscreen', sans-serif";
        } else {
          letter.style.fontFamily = "'Space Mono', sans-serif";
        }
        // console.log("Mouse entered the letter: " + letter.innerText);
      });

      letter.addEventListener("mouseleave", function () {
        // You can add additional JavaScript logic here if needed
        // console.log("Mouse left the letter: " + letter.innerText);
      });
    });
  });
}

const repeatedString = (str, times) => {
  return `${str.repeat(times)}`;
};

function updateBottomDateCircle(){
  if (getKeysByValue(collision__circle, true).length == 0){
    var temp = new Date();
    presentDateCircle(`TODAY'S DATE: ${
      temp.getMonth() + 1
    }/${temp.getDate()}/${temp.getFullYear()} TODAY'S DATE: ${
      temp.getMonth() + 1
    }/${temp.getDate()}/${temp.getFullYear()} TODAY'S DATE: ${
      temp.getMonth() + 1
    }/${temp.getDate()}/${temp.getFullYear()} `);
  } else {
    const temp = getKeysByValue(collision__circle, true);
    const stringtemp = classes[temp] + " ";
    presentDateCircle(repeatedString(stringtemp, 9));
    // text.classList.add('loaded');
  }
}

function presentDateCircle(input) {
  const text = document.querySelector(".text");
  const formattedInput = input.replace(/ /g, '\u00A0');

  text.innerText = formattedInput;

  var letters = text.innerText.split('');

  const angle = 360 / letters.length;

  text.innerHTML = letters
    .map(
      (letter, i) =>
        `<span style="transform: rotate(${i * angle}deg)">${letter}</span>`
    )
    .join('');

  
}

//setting border limit, setting timer to reset the position, increase the hitbox position;
