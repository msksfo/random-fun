
/******* VARIABLES ********/
const logoLink = document.getElementById('logo-link');

const plantsContent = document.querySelector('.plants-content');
const flowerModal = document.querySelector('.flower-modal');
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
    // make sure the animation is only triggered if an h2 was clicked
    if (e.target.classList.value === 'plant-title') {
        flowerModal.classList.add('flower-modal-expanded');

        modalItems.forEach(value => value.classList.add('show-modal-content'));
    }
});


closeModalButton.addEventListener('click', function (e) {
    // QUICKLY transition to hide the modal content
    modalItems.forEach(value => value.classList.add('hide-modal-content'));

    // close the modal, remove the class that shows the modal content
    modalItems.forEach(value => value.classList.remove('show-modal-content'));

    flowerModal.classList.remove('flower-modal-expanded');
});


// when the modal transition has ended, remove the class that adds the QUICK transition to hide modal content
flowerModal.addEventListener('transitionend', function (e) {
    modalItems.forEach(value => value.classList.remove('hide-modal-content'));
})



function scrollToTop() {
    window.scroll(0, 0)
}