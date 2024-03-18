

var logo_ke = document.getElementById("navbar__logo");
var tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 0.5} });

tl.to("#tip", { y: 20, opacity: 0, scaleY: 0.1, transformOrigin: "50% bottom", duration: 1})
  .fromTo("#extra", { opacity: 0 }, { opacity: 1 }, 0) // Start the animation at the same time as the previous one
  .fromTo("#i", { opacity: 0, scaleX: 0, transformOrigin: "50% 50%"}, { opacity: 1, scaleX: 1, transformOrigin: "50% 50%"}, 0); // Start the animation at the same time as the previous one

export const logo_animation = () => {
tl.pause();
  logo_ke.addEventListener("mouseenter", function () {
    tl.play(); // Play the timeline on hover
  });

  logo_ke.addEventListener("mouseleave", function () {
    tl.reverse(); // Reverse the timeline on mouse leave
  });
};
