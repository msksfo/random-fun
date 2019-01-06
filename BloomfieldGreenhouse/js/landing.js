let video = document.getElementById('js-daisyVideo');
let videoContainer = document.getElementById('js-video-container');

let mq = window.matchMedia("(min-width: 768px)");

if (mq.matches) {
    video.addEventListener('loadeddata', function () {

        if (video.readyState >= 2) {
            video.play();
        } else {
            videoContainer.classList.remove('video-container-video')
        }
    });
}