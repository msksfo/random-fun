(function() {
    /******* VARIABLES ********/

    let lastFocusedElement;

    const myDomNodes = {
        logoLink: document.getElementById('logo-link'),
        hamburgerIcon: document.querySelector('#js-mobile-icon'),
        mobileMenu: document.querySelector('#js-mobile-nav'),
        closeMobileNavButton: document.querySelector('.close-mobileNav-button'),
        plantsContent: document.querySelector('.plants-content'),
        plantsModal: document.querySelector('.plants-modal'),
        closeModalButton: document.querySelector('.close-modal-button'),
    };

    /****************************************************/
    /*                  Functions                       */
    /****************************************************/

    function scrollToTop() {
        window.scroll(0, 0);
    }

    // So the copyright date will always be the current year
    function setCurrentYear() {
        const year = document.querySelector('.year');
        let date = new Date();
        year.innerHTML = date.getFullYear();
    }

    function showMobileMenu(e) {
        // if the mobile navigation menu was opened with a keydown event, wait for the css transition (to slide in the mobile nav) to end, then apply focus to the button that closes the mobile nav menu
        if (e.type === 'keydown') {
            if (e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();

                myDomNodes.mobileMenu.classList.add('isOpen');
                toggleMobileMenuAria(myDomNodes.mobileMenu, 'aria-hidden');
                toggleMobileMenuAria(myDomNodes.hamburgerIcon, 'aria-expanded');

                myDomNodes.mobileMenu.addEventListener(
                    'transitionend',
                    function(e) {
                        //e.stopPropagation();
                        if (
                            e.propertyName === 'width' &&
                            e.target.clientWidth === 300
                        ) {
                            myDomNodes.closeMobileNavButton.focus();
                        }
                    }
                );
            }
        } else {
            // for click events
            myDomNodes.mobileMenu.classList.add('isOpen');
            toggleMobileMenuAria(myDomNodes.hamburgerIcon, 'aria-expanded');
            toggleMobileMenuAria(myDomNodes.mobileMenu, 'aria-hidden');
        }
    }

    // toggle the aria attributes of the hamburger icon and the mobile menu
    function toggleMobileMenuAria(elem, attr) {
        let value = elem.getAttribute(attr); // this will be a string

        // convert the above string value to a boolean
        let trueFalse = value === 'true';

        elem.setAttribute(attr, !trueFalse);
    }

    // close the mobile menu if user clicks / tabs on 'x', or any in page anchor link
    function hideMobileMenu() {
        myDomNodes.mobileMenu.classList.remove('isOpen');
        toggleMobileMenuAria(myDomNodes.mobileMenu, 'aria-hidden');
        toggleMobileMenuAria(myDomNodes.hamburgerIcon, 'aria-expanded');
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
                growingTips =
                    contentArr[0][contentArr[0].length - 1]['Growing Tips'];

                // use slice to get the array minus growing tips
                let contentWithoutTips = contentArr[0].slice(
                    0,
                    contentArr[0].length - 1
                );

                cardContent = `<ul>
                    ${contentWithoutTips
                        .map(item => `<li>${item}</li>`)
                        .join('')}
                </ul>
                
                <details>
                    <summary class='focusable'>Growing Tips</summary>
                    <p>${growingTips}</p>
                </details>`;
            } else {
                cardContent = `<ul>
                    ${contentArr.map(item => {
                        return item.map(value => `<li>${value}</li>`).join('');
                    })}
                </ul>`;
            }

            let modalCard = `<div class="modal-item">
                <h2 class="modal-item-header">${header}</h2>
                ${cardContent}
            </div`;

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
            dialog.setAttribute(
                'aria-label',
                `All ${ariaLabel}`.replace('&amp;', '&')
            );

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

        setAriaAttributes(e, myDomNodes.plantsModal);

        // css transform translateX opens the modal window
        myDomNodes.plantsModal.classList.add('plants-modal-expanded');

        let modalItems = document.querySelectorAll('.modal-item');

        // keyframes animation to show the modal content
        modalItems.forEach(value => value.classList.add('show-modal-content'));

        myDomNodes.closeModalButton.focus();
    }

    /* I did this because the modal window covers entire section ->  on mobile, the content might not be     visible which could leave the user confused
     */
    function scrollToTopOfModal() {
        let yPosition = myDomNodes.plantsModal.getBoundingClientRect().y;

        // get viewport width and scroll to top of modal window, adjusted for sticky header height
        let mq = window.matchMedia('(min-width: 500px)');
        mq.matches
            ? window.scrollBy(0, yPosition - 95)
            : window.scrollBy(0, yPosition - 131);
    }

    // take in the array of focusable items in the modal or mobile navigation, and create a loop to to prevent tabbing outside of these elements
    function createKeyboardTrap(arr, e) {
        let first = arr[0]; // this will be the button to close the modal window / mobile navigaion
        let last = arr[arr.length - 1];

        last.addEventListener('keydown', function(e) {
            if (e.keyCode === 9 && !e.shiftKey) {
                e.preventDefault();
                first.focus();
            }
        });

        first.addEventListener('keydown', function(e) {
            if (e.keyCode === 9 && e.shiftKey) {
                e.preventDefault();
                last.focus();
            }
        });
    }

    // clear all content from the modal window
    function clearModal() {
        const modalGrid = document.querySelector('.modal-grid');
        modalGrid.innerHTML = '';
    }

    function hideModal(e) {
        removeAriaAttributes(myDomNodes.plantsModal);

        let modalItems = document.querySelectorAll('.modal-item');

        // keyframes animation QUICKLY transitions to hide the modal content when the modal is closed
        modalItems.forEach(value => value.classList.add('hide-modal-content'));

        // css transform translateX closes the modal window
        myDomNodes.plantsModal.classList.remove('plants-modal-expanded');

        if (e.type === 'keydown') {
            myDomNodes.closeModalButton.setAttribute('tabindex', -1);

            // return focus to the element that held focus before the modal was open
            lastFocusedElement.focus();
        }
    }

    function main() {
        setCurrentYear();
    }

    /************************************************************************/
    /*                         EVENT LISTENERS                              */
    /************************************************************************/

    myDomNodes.logoLink.addEventListener('click', function() {
        scrollToTop();
    });

    myDomNodes.logoLink.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
            scrollToTop();
        }
    });

    myDomNodes.hamburgerIcon.addEventListener('click', showMobileMenu);
    myDomNodes.hamburgerIcon.addEventListener('keydown', showMobileMenu);

    myDomNodes.mobileMenu.addEventListener('keydown', function(e) {
        let xPressed = e.target.classList.contains('close-mobileNav-button');
        let allowedKeys =
            e.keyCode === 32 || e.keyCode === 13 || e.keyCode === 27;
        let anchorLink = e.target.classList.contains('mobile-nav-link');
        let enterPressed = e.keyCode === 13;

        // user pressed 'enter', 'space', or 'esc' on the button to close the mobile menu
        if (xPressed && allowedKeys) {
            e.preventDefault();
            hideMobileMenu();
            myDomNodes.hamburgerIcon.focus();
        } else if (enterPressed && anchorLink) {
            // user pressed 'enter' on an in page anchor link
            hideMobileMenu();
        }
    });

    myDomNodes.mobileMenu.addEventListener('click', function(e) {
        // user clicked the button to close the mobile menu or they clicked an in page anchor link
        let xPressed = e.target.classList.contains('close-mobileNav-button');
        let anchorLink = e.target.classList.contains('mobile-nav-link');

        if (xPressed || anchorLink) {
            hideMobileMenu();
        }
    });

    // keep focus within mobile menu while it's open
    myDomNodes.closeMobileNavButton.addEventListener('keydown', function(e) {
        if (e.keyCode === 9) {
            e.stopPropagation();
            let button = myDomNodes.mobileMenu.querySelector(
                '.close-mobileNav-button'
            );
            let links = Array.from(
                myDomNodes.mobileMenu.querySelectorAll('.mobile-nav-link')
            );

            let focusableItems = [button, ...links];

            createKeyboardTrap(focusableItems, e);
        }
    });

    // user can close the mobile menu by clicking anywhere outside of it
    document.addEventListener('click', function(e) {
        // make sure they are not trying to open the mobile menu
        if (
            e.target !== myDomNodes.hamburgerIcon &&
            e.target.parentElement !== myDomNodes.hamburgerIcon
        ) {
            // make sure the mobile menu is open
            if (
                e.target !== myDomNodes.mobileMenu &&
                myDomNodes.mobileMenu.classList.contains('isOpen')
            ) {
                hideMobileMenu();
            }
        }
    });

    // the modal window with details of each plant type
    myDomNodes.plantsContent.addEventListener('click', function(e) {
        // make sure the animation is only triggered if the button to open/close the modal was clicked
        if (e.target.classList.value === 'open-modal') {
            buildModalItemCards(e);
            showModal(e);
            scrollToTopOfModal();
        } else if (
            e.target.classList.value === 'close-modal-button focusable'
        ) {
            hideModal(e);
        }
    });

    // the modal window with details of each plant type
    myDomNodes.plantsContent.addEventListener('keydown', function(e) {
        // user can open the modal by pressing 'enter', or the space bar
        if (
            e.target.classList.value === 'open-modal' &&
            (e.keyCode === 13 || e.keyCode === 32)
        ) {
            // prevent default behavior of enter and space
            e.preventDefault();

            buildModalItemCards(e); // build the cards
            showModal(e); // open the modal window
            scrollToTopOfModal(); // scroll to top of modal window
        } else {
            // user can close modal with space, enter, or escape
            if (
                e.target.classList.value === 'close-modal-button focusable' &&
                (e.keyCode === 32 || e.keyCode === 13 || e.keyCode === 27)
            ) {
                // prevent the default behavior of the space key, enter, escape
                e.preventDefault();

                hideModal(e);
            }
        }
    });

    /*
    when the transition to close the modal window (by removing the class .plants-modal-expanded) is complete, clear all html content from the modal
    */
    myDomNodes.plantsContent.addEventListener('transitionend', function(e) {
        // conditionals to ensure the event only fires on the intended transition
        if (
            e.propertyName === 'transform' &&
            e.target.classList.value === 'plants-modal'
        ) {
            clearModal();
        }
    });

    // determine what should happen when the user tabs on the closeModalButton
    myDomNodes.closeModalButton.addEventListener('keydown', function(e) {
        let focusableItems = myDomNodes.plantsModal.querySelectorAll(
            '.focusable'
        );

        if (focusableItems.length === 1) {
            // nothing can be tabbed to
            if (e.keyCode === 9) {
                e.preventDefault();
            }
        } else {
            // if any of the modal cards in the modal window show growing tips, the user can tab to them
            myDomNodes.closeModalButton.setAttribute('tabindex', 0);
            createKeyboardTrap(focusableItems, e);
        }
    });

    main();
})();
