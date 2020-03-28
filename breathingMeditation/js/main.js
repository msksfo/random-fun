// * VARIABLES

let breath = document.querySelector('.expanding');
let breathDurationInput = document.querySelector('#breath-duration');
let changeBreathDurationButton = document.querySelector(
    '#change-breath-duration-button'
);

// set the date in the footer
let year = document.querySelector('#year');
year.textContent = new Date().getFullYear();

// this variable is here so I can stop the clearInterval() later
let colorAnimation;

// * FUNCTIONS

function init(animationInterval) {
    breath.style.animationDuration = animationInterval / 1000 + 's';

    breath.classList.add('active');

    /* console.log(
        window.getComputedStyle(breath).getPropertyValue('animation-duration')
    );
    */

    colorAnimation = setInterval(startColorAnimation, animationInterval);
}

function startColorAnimation() {
    breath.style.backgroundColor = changeColor();
}

function changeColor() {
    let hex = Math.random()
        .toString(16)
        .slice(2, 8);

    return `#${hex}`;
}

// * EVENT LISTENERS

changeBreathDurationButton.addEventListener('click', function() {
    if (colorAnimation) {
        clearInterval(colorAnimation);

        //? do i need this line?
        colorAnimation = null;

        breath.classList.remove('active');

        let seconds = breathDurationInput.value * 1000;

        setTimeout(function() {
            init(seconds);
        }, 1000);
    }
});

init(10000);

/* TODO: 
    1. make an advanced control? this would let user breathe in for x seconds and out for x seconds??
    2. clean this up and organize it. make it more object-oriented?
    3. make the function inside the event listener an external function
    4. make a readme file
*/
