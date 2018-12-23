
/******* VARIABLES ********/
const logoLink = document.getElementById('logo-link');

const plantsContent = document.querySelector('.plants-content');
const plantsModal = document.querySelector('.plants-modal');
const modalItems = document.querySelectorAll('.modal-item');
const closeModalButton = document.querySelector('.close-modal-button');
let lastFocusedElement;


/******** FUNCTIONS ********/

function scrollToTop() {
    window.scroll(0, 0)
}


// So the copyright date will always be the current year
function setCurrentYear() {
    const year = document.querySelector('.year');
    let date = new Date();
    year.innerHTML = date.getFullYear();
}



function showModal(e) {
    plantsModal.classList.add('plants-modal-expanded');

    // TODO: only show the modal items of the parent that was clicked
    modalItems.forEach(value => value.classList.add('show-modal-content'));

    // make the modal visible to screen readers
    plantsModal.setAttribute('aria-hidden', false);

    /*
        if a keyboard event triggered the modal, 
        1. remember which element was in focus before opening the modal
        2. set focus on the close button when the modal is opened
        3. create a keyboard trap to prevent tabbing outside the modal
    */
    if (e.type === 'keydown') {
        lastFocusedElement = document.activeElement;

        closeModalButton.focus();

        plantsModal.addEventListener('keydown', function (e) {
            if (e.keyCode === 9) {
                e.preventDefault()
            }
        })
    }

}

function hideModal(e) {

    // QUICKLY transition to hide the modal content when the modal is closed
    modalItems.forEach(value => value.classList.add('hide-modal-content'));

    // close the modal, remove the class that shows the modal content
    modalItems.forEach(value => value.classList.remove('show-modal-content'));

    plantsModal.classList.remove('plants-modal-expanded');

    // hide the modal from screen readers
    plantsModal.setAttribute('aria-hidden', true);

    if (e.type === 'keydown') {
        // return focus to the element that held focus before the modal was open 
        lastFocusedElement.focus();
    }

}

/******** EVENT LISTENERS ********/

logoLink.addEventListener('click', scrollToTop);

logoLink.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        window.scroll(0, 0);
    }
});


plantsContent.addEventListener('click', function (e) {

    // make sure the animation is only triggered if the open modal button was clicked
    if (e.target.classList.value === 'open-modal-alternate') { // .plant-title or .open-modal???

        showModal(e);
    } else if (e.target.classList.value === 'close-modal-button') {

        hideModal(e)
    }
});


plantsContent.addEventListener('keydown', function (e) {

    // user can open the modal by pressing 'enter', or the space bar
    if ((e.target.classList.value === 'open-modal-alternate') && (e.keyCode === 13 || e.keyCode === 32)) {
        // prevent default behavior of enter and space
        e.preventDefault();

        showModal(e);

    } else {  // user can close modal with space (if block), enter or escapse (if/else block)
        if ((e.target.classList.value === 'close-modal-button') && (e.keyCode === 32)) {
            // prevent the default behavior of the space key
            e.preventDefault();

            hideModal(e);

        } else if ((e.target.classList.value === 'close-modal-button') && (e.keyCode === 13 || e.keyCode === 27)) {

            // prevent the default behavior of enter
            e.preventDefault();

            hideModal(e);
        }
    }
});



/*
    when the transition to close the modal window (by removing the class .plants-modal-expanded) is complete, remove the class that adds the QUICK transition to hide modal content
*/
plantsContent.addEventListener('transitionend', function (e) {
    // conditionals to ensure the event only fires on the intended transition
    if (e.propertyName === 'transform' && e.target.classList.value === 'plants-modal') {
        modalItems.forEach(value => value.classList.remove('hide-modal-content'));
    }

})

function main() {
    setCurrentYear();
}

main();
