let video = document.getElementById('js-daisyVideo');
let videoContainer = document.getElementById('js-video-container');

let mq = window.matchMedia("(min-width: 768px)");


// check if the video is ready. if so, play it. if not, load the photo and check again in half a second
function checkforVideo() {
    var videoCheck = setInterval(() => {
        if (video.readyState >= 2) {
            video.play();
            clearInterval(videoCheck);
        } else {
            videoContainer.classList.remove('video-container-video')
        }
    }, 500);
}


if (mq.matches) {
    video.addEventListener('loadeddata', checkforVideo);
}