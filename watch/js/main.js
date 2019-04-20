const secondHand = document.querySelector('.second-hand');
const minuteHand = document.querySelector('.minute-hand');
const hourHand = document.querySelector('.hour-hand');
const date = document.querySelector('.date');

const today = new Date();
date.textContent = today.getDate();

function updateTime() {
    const now = new Date();

    const seconds = now.getSeconds();
    const secondsDegrees = (seconds / 60) * 360 + 90;

    const minutes = now.getMinutes();
    const minutesDegrees = (minutes / 60) * 360 + 90;

    const hours = now.getHours();
    const hoursDegrees = 30 * (hours % 12) + minutes / 60 + 90;

    secondHand.style.transform = 'rotate(' + secondsDegrees + 'deg)';

    minuteHand.style.transform = 'rotate(' + minutesDegrees + 'deg)';

    hourHand.style.transform = 'rotate(' + hoursDegrees + 'deg)';
}

setInterval(updateTime, 1000);
