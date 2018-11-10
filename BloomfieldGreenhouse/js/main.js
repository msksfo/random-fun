

// So the copyright date will always be the current year
const year = document.querySelector('.year');
let date = new Date();
year.innerHTML = date.getFullYear();


const logoLink = document.getElementById('logo-link');
logoLink.addEventListener('click', scrollToTop);

logoLink.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        window.scroll(0, 0);
    }
});

function scrollToTop() {
    window.scroll(0, 0)
}