var logo_ke = document.getElementById("navbar__logo");
var tl = gsap.timeline({ defaults: { ease: 'power4.in', duration: 0.5} });
// import { isTouchDevice } from "./device";

export const logo_animation = () => {
  // if (!isTouchDevice()) {
    tl.to("#tip", { y: 20, opacity: 0, scaleY: 0.1, transformOrigin: "50% bottom", duration: 0.2})
      .fromTo("#extra", { opacity: 0 }, { opacity: 1 }, 0)
      .fromTo("#i", { opacity: 0, scaleX: 0, transformOrigin: "50% 50%"}, { opacity: 1, scaleX: 1, transformOrigin: "50% 50%" }, 0);

    tl.pause();
    logo_ke.addEventListener("mouseenter", function () {
      tl.play();
    });

    logo_ke.addEventListener("mouseleave", function () {
      tl.reverse();
    });
};




// GSAP animation for flipping the letters upside down
// gsap.set(".text span", { rotationX: 180 });