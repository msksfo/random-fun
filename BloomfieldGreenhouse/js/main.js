

/******* VARIABLES ********/
const logoLink = document.getElementById('logo-link');

const plantsContent = document.querySelector('.plants-content');
const plantsModal = document.querySelector('.plants-modal');
//let modalItems = document.querySelectorAll('.modal-item');
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


// get the plant data, to be used in the modal items when the plants modal is opened
function getPlantData(dataObject) {
    return dataObject;
}


function buildModalItemCards(e) {
    const plantData = getPlantData(plantInfo);
    const modalGrid = document.querySelector('.modal-grid');

    // get the h2 corresponding to the button that was clicked (flowers, herbs, etc)
    let plantType = e.target.parentElement.previousElementSibling.innerHTML;

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


//give the modal window an aria label, according to the plant type that was clicked
function setAriaLabel(e, dialog) {
    let ariaLabel = e.target.parentElement.previousElementSibling.innerHTML;

    // replace the html entity, if present
    if (ariaLabel.includes('&amp;')) {
        return dialog.setAttribute('aria-label', `All ${ariaLabel}`.replace('&amp;', '&'));
    }

    return dialog.setAttribute('aria-label', `All ${ariaLabel}`);
}


function removeAriaLabel(dialog) {
    return dialog.removeAttribute('aria-label');
}


function handleKeydownEvent(e) {
    if (e.type === 'keydown') {
        lastFocusedElement = document.activeElement;

        // make an array of elements that can be tabbed to when modal is open
        let focusableItems = plantsModal.querySelectorAll('.focusable');
        focusableItems[0].focus(); // this is the close button

        plantsModal.addEventListener('keydown', function (e) {

            if (focusableItems.length === 1) {
                if (e.keyCode === 9) {
                    e.preventDefault()
                }
            } else {

                let first = focusableItems[0];
                let second = focusableItems[1];
                let last = focusableItems[focusableItems.length - 1];

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

                // WHY DID I HAVE TO DO THIS????????
                second.addEventListener('keydown', function (e) {
                    if ((e.keyCode === 9) && (e.shiftKey)) {
                        e.preventDefault();
                        first.focus();
                    }
                })
            }

        })
    }
}


function showModal(e) {
    setAriaLabel(e, plantsModal);

    let modalItems = document.querySelectorAll('.modal-item');

    // css transform translateX opens the modal window
    plantsModal.classList.add('plants-modal-expanded');

    // keyframes animation to show the modal content
    modalItems.forEach(value => value.classList.add('show-modal-content'));

    // make the modal visible to screen readers
    plantsModal.setAttribute('aria-hidden', false);


    /*
        if a keyboard event triggered the modal, 
        1. remember which element was in focus before opening the modal
        2. set focus on the close button when the modal is opened
        3. create a keyboard trap to prevent tabbing outside the modal
    */
    //handleKeydownEvent(e);

    if (e.type === 'keydown') {
        lastFocusedElement = document.activeElement;

        // make an array of elements that can be tabbed to when modal is open
        let focusableItems = plantsModal.querySelectorAll('.focusable');
        focusableItems[0].focus(); // this is the close button

        plantsModal.addEventListener('keydown', function (e) {

            if (focusableItems.length === 1) {
                if (e.keyCode === 9) {
                    e.preventDefault()
                }
            } else {

                let first = focusableItems[0];
                let second = focusableItems[1];
                let last = focusableItems[focusableItems.length - 1];

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

                // WHY DID I HAVE TO DO THIS????????
                second.addEventListener('keydown', function (e) {
                    if ((e.keyCode === 9) && (e.shiftKey)) {
                        e.preventDefault();
                        first.focus();
                    }
                })
            }

        })
    }

}


// clear all content from the modal window
function clearModal() {
    const modalGrid = document.querySelector('.modal-grid');
    modalGrid.innerHTML = '';
}



function hideModal(e) {
    removeAriaLabel(plantsModal);

    let modalItems = document.querySelectorAll('.modal-item');

    // keyframes animation QUICKLY transitions to hide the modal content when the modal is closed
    modalItems.forEach(value => value.classList.add('hide-modal-content'));

    // css transform translateX closes the modal window
    plantsModal.classList.remove('plants-modal-expanded');

    // hide the modal from screen readers
    plantsModal.setAttribute('aria-hidden', true);

    if (e.type === 'keydown') {
        // return focus to the element that held focus before the modal was open 
        lastFocusedElement.focus();
    }
}


function main() {
    setCurrentYear();
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
        buildModalItemCards(e);
        showModal(e);
    } else if (e.target.classList.value === 'close-modal-button focusable') {
        hideModal(e)
    }
});


plantsContent.addEventListener('keydown', function (e) {

    // user can open the modal by pressing 'enter', or the space bar
    if ((e.target.classList.value === 'open-modal-alternate') && (e.keyCode === 13 || e.keyCode === 32)) {
        // prevent default behavior of enter and space
        e.preventDefault();

        buildModalItemCards(e);
        showModal(e);

    } else {  // user can close modal with space (if block), enter or escapse (if/else block)
        if ((e.target.classList.value === 'close-modal-button focusable') && (e.keyCode === 32)) {
            // prevent the default behavior of the space key
            e.preventDefault();

            hideModal(e);

        } else if ((e.target.classList.value === 'close-modal-button focusable') && (e.keyCode === 13 || e.keyCode === 27)) {

            // prevent the default behavior of enter
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
        clearModal()
    }

});


main();
