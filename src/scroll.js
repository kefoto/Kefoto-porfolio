// different sections for 2 page

let photoScrolled = false; 

export const photo_expansion_add = () => {
    if (!photoScrolled) { // Execute only if photo_scroll hasn't been executed yet
        var section = document.createElement("section");
    
        // Optionally, add content to the section
        section.id = "photo_expansion";
        section.innerHTML = '<p id="testing">yep</p>';
    
        // Find the container element
        var bodyElement = document.body;
    
        // Insert the section element after the existing section
        bodyElement.appendChild(section);
    
        photoScrolled = true; // Set the flag to true after executing photo_scroll
      }
};

export const photo_expansion_remove = () =>{
    var sectionToRemove = document.getElementById('photo_expansion');

  if (sectionToRemove) {
    // Remove the section element
    sectionToRemove.remove();
    photoScrolled = false; // Reset the flag to false since the section is removed
  }
}
