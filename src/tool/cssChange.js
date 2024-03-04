var isTransitioning;

export const check_n_update_style = (element, property, newValue) =>{
    var computedStyles = window.getComputedStyle(element);

    var oldValue = computedStyles.getPropertyValue(property);

    //TODO: transition:
    // var transitionDurationInSeconds = parseFloat(computedStyles.transitionDuration);
    var isTransitioning =
    computedStyles.transitionProperty !== 'none';

    
    // setTimeout(() => {
    //     isTransitioning = false;
    // }, transitionDurationInSeconds*1000+10)
    // console.log(oldValue, newValue);
    
    if(oldValue == newValue || isTransitioning){
        console.log("yep");
        return;
    } else {
        element.style[property] = newValue;
    }
}