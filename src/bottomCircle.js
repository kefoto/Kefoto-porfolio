import {
  getKeysByValue,
  collision__circle,
  classes,
} from "./container_collision.js";

//TODO: this lags when the website first loads
// TODO: animation issue/position issue when the drag move from one circle to another, probability dely issue

const text = document.querySelector(".text");
const circle_spin = document.getElementById("welcome");

let isDragOutside = true;
let prevCollidedContainer = null;

gsap.to(".yep", {
  rotation: 360, // Rotate 360 degrees
  duration: 90, // 90 seconds duration
  ease: "linear", // Linear easing
  repeat: -1, // Repeat infinitely
  overwrite: "auto",
});

const translate_const = {
  abt: {x: "-35%", y:"-35%"},
  dta: {x:"35%", y:"-35%"},
  fto: {x:"-35%", y:"35%"},
  ptr: {x:"35%", y:"35%"}
}

export const updateBottomDateCircle = () => {
  const currentCollidedContainer = getKeysByValue(collision__circle, true)[0];

  // change text content
  if (getKeysByValue(collision__circle, true).length == 0) {
    var temp = new Date();
    const dateString = `TODAY'S DATE: ${
      temp.getMonth() + 1
    }/${temp.getDate()}/${temp.getFullYear()} `;

    if (!isDragOutside) {
      isDragOutside = true;
      gsap.killTweensOf(circle_spin);
      gsap.to(circle_spin, { opacity: 0, duration: 0.5 }).then(() => {
        gsap
          .to(circle_spin, {
            left: "50%",
            top: "50%",
            x: 0,
            y: 0,
            duration: 0.3,
            onComplete: function () {
              presentDateCircle(repeatedString(dateString, 3));
            },
          })
          .then(() => {
            gsap.to(circle_spin, { opacity: 1, duration: 0.2 });
          });
      });
    }
  } else {
    const temp = getKeysByValue(collision__circle, true);
    const drag_receive = document.getElementById(temp);
    if (isDragOutside || currentCollidedContainer !== prevCollidedContainer) {
      isDragOutside = false;
      prevCollidedContainer = currentCollidedContainer;
      gsap.killTweensOf(circle_spin);
      gsap
        .to(circle_spin, { opacity: 0, duration: 0.5, ease: "power1.out" })
        .then(() => {
          const rect = drag_receive.getBoundingClientRect();

          const centerX =
            drag_receive.offsetLeft + drag_receive.offsetWidth / 2;
          const centerY =
            drag_receive.offsetTop + drag_receive.offsetHeight / 2;


          // console.log(centerX,centerY,rect.left + rect.width / 2, rect.left + rect.width / 2);
          const stringtemp = classes[temp] + " ";
          // Change position and set opacity to 1
          gsap
            .to(circle_spin, {
              left: centerX + "px",
              top: centerY + "px",
              x: translate_const[temp].x,
              y: translate_const[temp].y,
              // transform:
              duration: 0.3,
              onComplete: function () {
                presentDateCircle(repeatedString(stringtemp, 9));
              },
            })
            .then(() => {
              gsap.to(circle_spin, { opacity: 1, duration: 0.2 });
            });
        });
    }
    // text.classList.add('loaded');
  }
};

export const presentDateCircle = (input) => {
  const formattedInput = input.replace(/ /g, "\u00A0");

  text.innerText = formattedInput;

  var letters = text.innerText.split("");

  const angle = 360 / letters.length;

  text.innerHTML = letters
    .map(
      (letter, i) =>
        `<span style="transform: rotate(${i * angle}deg)">${letter}</span>`
    )
    .join("");
};

export const repeatedString = (str, times) => {
  return `${str.repeat(times)}`;
};
