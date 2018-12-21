
/******* VARIABLES ********/
const logoLink = document.getElementById('logo-link');

const plantsContent = document.querySelector('.plants-content');
const plantsModal = document.querySelector('.plants-modal');
const modalItems = document.querySelectorAll('.modal-item');
const closeModalButton = document.querySelector('.close-modal-button');

// So the copyright date will always be the current year
const year = document.querySelector('.year');
let date = new Date();
year.innerHTML = date.getFullYear();



/******** FUNCTIONS ********/

function scrollToTop() {
    window.scroll(0, 0)
}


/******** EVENT LISTENERS ********/

logoLink.addEventListener('click', scrollToTop);

logoLink.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        window.scroll(0, 0);
    }
});


plantsContent.addEventListener('click', function (e) {
    console.log(e.target.classList.value)
    console.log(plantsModal);

    // make sure the animation is only triggered if an h2 was clicked
    if (e.target.classList.value === 'open-modal-alternate') { // .plant-title or .open-modal???
        plantsModal.classList.add('plants-modal-expanded');

        // TODO: only show the modal items of the parent that was clicked
        modalItems.forEach(value => value.classList.add('show-modal-content'));
    }
});


closeModalButton.addEventListener('click', function (e) {
    // QUICKLY transition to hide the modal content when the modal is closed
    modalItems.forEach(value => value.classList.add('hide-modal-content'));

    // close the modal, remove the class that shows the modal content
    modalItems.forEach(value => value.classList.remove('show-modal-content'));
    plantsModal.classList.remove('plants-modal-expanded');
});


// when the modal transition has ended, remove the class that adds the QUICK transition to hide modal content
plantsModal.addEventListener('transitionend', function (e) {
    modalItems.forEach(value => value.classList.remove('hide-modal-content'));
})



function scrollToTop() {
    window.scroll(0, 0)
}