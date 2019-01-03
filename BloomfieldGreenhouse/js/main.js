

/******* VARIABLES ********/
const logoLink = document.getElementById('logo-link');
const hamburgerIcon = document.querySelector('#js-mobile-icon');
const mobileMenu = document.querySelector('#js-mobile-nav');

const plantsContent = document.querySelector('.plants-content');
const plantsModal = document.querySelector('.plants-modal');
//let modalItems = document.querySelectorAll('.modal-item');
let closeModalButton = document.querySelector('.close-modal-button');

let lastFocusedElement;
let lastYposition;



/******** FUNCTIONS ********/

function scrollToTop() {
    window.scroll(0, 0);
}

// So the copyright date will always be the current year
function setCurrentYear() {
    const year = document.querySelector('.year');
    let date = new Date();
    year.innerHTML = date.getFullYear();
}


// show mobile menu
function showMobileMenu(e) {
    let closeButton = document.querySelector('.close-mobileNav-button');

    if (e.type === 'keydown') {
        if (e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();
            setMobileMenuStyles();

            closeButton.focus(); // TODO: why is this not working?????
        }
    } else {
        setMobileMenuStyles();
    }

}


function setMobileMenuStyles() {
    mobileMenu.style.width = '300px';
    mobileMenu.setAttribute('aria-hidden', false);
    hamburgerIcon.setAttribute('aria-expanded', true);

    mobileMenu.style.opacity = '1';
    mobileMenu.style.visibility = 'visible';
}


function removeMobileMenuStyles() {
    mobileMenu.style.width = '0';
    mobileMenu.setAttribute('aria-hidden', true);
    hamburgerIcon.setAttribute('aria-expanded', false);

    mobileMenu.style.opacity = '0';
    mobileMenu.style.visibility = 'hidden';
}


// close the mobile menu if user clicks / tabs on 'x', or any in page anchor link
function hideMobileMenu(e) {
    // conditionals ensure user specifically clicked the close button or an anchor link
    if (e.type === 'keydown') { // for keyboard events

        // enter / space on the button to close the mobile menu
        if (e.target.classList.value.includes('close-mobileNav-button')) {
            removeMobileMenuStyles();

            //TODO: why is this not working????
            hamburgerIcon.focus(); // put focus back where it was before mobile menu was opened

        } else if (e.target.classList.value.includes('mobile-nav-link')) {
            // enter on in page anchor link
            removeMobileMenuStyles();
        }
    } else { // for click events
        if (e.target.classList.value.includes('close-mobileNav-button') || e.target.classList.value.includes('mobile-nav-link')) {
            removeMobileMenuStyles();
        }
    }
}


// get the plant data, to be used in the modal items when the plants modal is opened
function getPlantData(dataObject) {
    return dataObject;
}


function buildModalItemCards(e) {
    const plantData = getPlantData(plantInfo);
    const modalGrid = document.querySelector('.modal-grid');

    // get the h2 corresponding to the button that was clicked (flowers, herbs, etc)
    let plantType = e.target.parentElement.children[0].innerHTML;

    // get the array of plants from the type that was clicked
    let plantsArr = plantData[plantType]; // ie sun, sun / shade, shade

    // loop over the array of plants, and use string templating to build out the cards with the corresponding headers, list items, and growing tips when available
    plantsArr.forEach((value, index) => {
        let header = Object.keys(plantsArr[index]);
        let contentArr = Object.values(value);
        let growingTips;
        let cardContent;

        // when present, growing tips will be an object and will be the last item in the contentArr
        if (typeof contentArr[0][contentArr[0].length - 1] !== 'string') {
            // if present, get the growing tips
            growingTips = contentArr[0][contentArr[0].length - 1]['Growing Tips'];

            // use slice to get the array minus growing tips
            let contentWithoutTips = contentArr[0].slice(0, contentArr[0].length - 1);

            cardContent =
                `<ul>
                    ${contentWithoutTips.map(item => `<li>${item}</li>`).join('')}
                </ul>
                
                <details>
                    <summary class='focusable'>Growing Tips</summary>
                    <p>${growingTips}</p>
                </details>`
        } else {
            cardContent =
                `<ul>
                    ${contentArr.map(item => {
                    return item.map(value => `<li>${value}</li>`).join('')
                })}
                </ul>`
        }

        let modalCard =
            `<div class="modal-item">
                <h2 class="modal-item-header">${header}</h2>
                ${cardContent}
            </div`

        // add each card to the modal grid div
        modalGrid.innerHTML += modalCard;
    });

}


// make modal visible to screen readers & set aria label for modal window
function setAriaAttributes(e, dialog) {

    //give the modal window an aria label, according to the plant type that was clicked
    let ariaLabel = e.target.parentElement.children[0].innerHTML;

    // replace the html entity, if present
    if (ariaLabel.includes('&amp;')) {
        dialog.setAttribute('aria-label', `All ${ariaLabel}`.replace('&amp;', '&'));

        dialog.setAttribute('aria-hidden', false);
    } else {
        dialog.setAttribute('aria-label', `All ${ariaLabel}`);

        dialog.setAttribute('aria-hidden', false);
    }
}

// hide modal from screen readers & remove aria label from modal window
function removeAriaAttributes(dialog) {
    dialog.removeAttribute('aria-label');
    dialog.setAttribute('aria-hidden', true);
}


function showModal(e) {
    // remember which element was in focus before opening the modal
    lastFocusedElement = document.activeElement;

    setAriaAttributes(e, plantsModal);

    // css transform translateX opens the modal window
    plantsModal.classList.add('plants-modal-expanded');

    let modalItems = document.querySelectorAll('.modal-item');

    // keyframes animation to show the modal content
    modalItems.forEach(value => value.classList.add('show-modal-content'));

    closeModalButton.focus();
}


/* I did this because the modal window covers entire section ->  on mobile, the content might not be     visible which could leave the user confused
*/
function scrollToTopOfModal() {
    let yPosition = plantsModal.getBoundingClientRect().y;
    lastYposition = yPosition;

    // get viewport width and scroll to top of modal window, adjusted for sticky header height
    let mq = window.matchMedia("(min-width: 500px)");
    mq.matches ? window.scrollBy(0, yPosition - 95) : window.scrollBy(0, yPosition - 131);
}


// take in the array of focusable items in the modal window, and create a loop to to prevent tabbing outside of these elements 
function createKeyboardTrap(arr, e) {

    let first = arr[0]; // this will be the button to close the modal window
    let last = arr[arr.length - 1];

    last.addEventListener('keydown', function (e) {
        if ((e.keyCode === 9) && (!e.shiftKey)) {
            e.preventDefault();
            first.focus();
        }
    });

    first.addEventListener('keydown', function (e) {

        if ((e.keyCode === 9) && (e.shiftKey)) {
            e.preventDefault();
            last.focus();
        }
    })
}


// clear all content from the modal window
function clearModal() {
    const modalGrid = document.querySelector('.modal-grid');
    modalGrid.innerHTML = '';
}


function hideModal(e) {
    removeAriaAttributes(plantsModal);

    let modalItems = document.querySelectorAll('.modal-item');

    // keyframes animation QUICKLY transitions to hide the modal content when the modal is closed
    modalItems.forEach(value => value.classList.add('hide-modal-content'));

    // css transform translateX closes the modal window
    plantsModal.classList.remove('plants-modal-expanded');

    if (e.type === 'keydown') {
        closeModalButton.setAttribute('tabindex', -1);

        // return focus to the element that held focus before the modal was open 
        lastFocusedElement.focus();
    }
}


function main() {
    setCurrentYear();
}



/******** EVENT LISTENERS ********/

logoLink.addEventListener('click', function () {
    scrollToTop();
});


logoLink.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        scrollToTop();
    }
});


plantsContent.addEventListener('click', function (e) {
    // make sure the animation is only triggered if the button to open/close the modal was clicked
    if (e.target.classList.value === 'open-modal') {
        buildModalItemCards(e);
        showModal(e);
        scrollToTopOfModal();
    } else if (e.target.classList.value === 'close-modal-button focusable') {
        hideModal(e);
    }
});


plantsContent.addEventListener('keydown', function (e) {
    // user can open the modal by pressing 'enter', or the space bar
    if ((e.target.classList.value === 'open-modal') && (e.keyCode === 13 || e.keyCode === 32)) {

        // prevent default behavior of enter and space
        e.preventDefault();

        buildModalItemCards(e); // build the cards
        showModal(e); // open the modal window
        scrollToTopOfModal(); // scroll to top of modal window

    } else if ((e.target.classList.value === 'close-modal-button focusable') && (e.keyCode === 9)) {

    } else {  // user can close modal with space, enter,  or escapse
        if ((e.target.classList.value === 'close-modal-button focusable') && (e.keyCode === 32 || e.keyCode === 13 || e.keyCode === 27)) {

            // prevent the default behavior of the space key, enter, escape
            e.preventDefault();

            hideModal(e);
        }
    }
});


/*
when the transition to close the modal window (by removing the class .plants-modal-expanded) is complete, clear all html content from the modal
*/
plantsContent.addEventListener('transitionend', function (e) {
    // conditionals to ensure the event only fires on the intended transition
    if (e.propertyName === 'transform' && e.target.classList.value === 'plants-modal') {
        clearModal();
    }
});


// determine what should happen when the user tabs on the closeModalButton
closeModalButton.addEventListener('keydown', function (e) {
    let focusableItems = plantsModal.querySelectorAll('.focusable');

    if (focusableItems.length === 1) { // nothing can be tabbed to
        if (e.keyCode === 9) {
            e.preventDefault();
        }
    } else {
        // if any of the modal cards in the modal window show growing tips, the user can tab to them
        closeModalButton.setAttribute('tabindex', 0);
        createKeyboardTrap(focusableItems, e);
    }
});


hamburgerIcon.addEventListener('click', showMobileMenu);

hamburgerIcon.addEventListener('keydown', showMobileMenu);
//TODO: make mobile menu work for keydown events


mobileMenu.addEventListener('click', function (e) {
    hideMobileMenu(e)
});


// user can close the mobile menu by clicking anywhere outside of it
document.body.addEventListener('click', function (e) {
    // make sure they are not trying to open the mobile menu
    if (e.target !== hamburgerIcon) {
        // make sure the mobile menu is open
        if ((e.target !== mobileMenu) && (mobileMenu.style.width > '0')) {
            removeMobileMenuStyles();
        }
    }
});

main();
