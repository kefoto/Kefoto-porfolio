// different sections for 2 page
let photoScrolled = false;

let tl;
let tl2;
// TODO: scroll bar size change
//TODO: resize issue, after the condition is off and the animation is disabled
//TODO: the background sometimes block the interaction, block on pc.
//TODO: the playground is not sticky
export const photo_expansion_add = () => {
  if (!photoScrolled) {
    // Execute only if photo_scroll hasn't been executed yet
    var section = document.createElement("section");

    // Optionally, add content to the section
    section.id = "photo_expansion";
    section.innerHTML = '<p id="testing">Scroll Animations, WIP</p>';

    // Find the container element
    var bodyElement = document.body;
    
    // Insert the section element after the existing section
    bodyElement.appendChild(section);

    console.log(tl);
    tl = gsap.timeline({
      
      scrollTrigger: {
        trigger: ".pinned",
        start: "top top",
        end: "+=2000",
        pin: true,
        pinSpacing: false,
        markers: true,
        invalidateOnRefresh: true
      },
      

    });

    tl2 = gsap.timeline({
      scrollTrigger: {
      trigger: "#testing",
      start: "20px 60%",
      end: "+=500",
      scrub: 1.2,
      markers: true,
      // pin:"#playground",
    },});
    tl2.to("#testing", { x: 800});
    

    console.log(tl);
    
    photoScrolled = true; // Set the flag to true after executing photo_scroll
  }
};

export const photo_expansion_remove = () => {
  var sectionToRemove = document.getElementById("photo_expansion");

  if (sectionToRemove) {
    // Remove the section element
    sectionToRemove.remove();

     // Update the ScrollTrigger configuration to remove pinning from #playground
    //  gsap.set("#playground", { clearProps: "all" }); // Clear all props
    photoScrolled = false; // Reset the flag to false since the section is removed

    if (tl) {
      tl.kill();
    }
    if (tl2) {
      tl2.kill();
    }



    tl = tl2 = null;
  }
};



const lenis = new Lenis();

lenis.on("scroll", (e) => {
  // console.log(e);
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
