


function playSound(e) {
	const audio = document.querySelector(`audio[data-letter="${e.keyCode}"]`);
	const letters = document.querySelectorAll(`.letter[data-letter="${e.keyCode}"]`);

	if (!audio) { // don't run the function if they type a key that does not have audio clip
		return
	}

	audio.currentTime = 0; /*rewind the audio clip, so they can click one key multiple times
	 quickly in succession */
	audio.play();

	letters.forEach(letter => letter.classList.add('playing'));

	//letters.classList.add('playing');
}

function removeTransition(e) {
	if (e.propertyName !== 'transform') return;

	this.classList.remove('playing');
}

const letters = document.querySelectorAll('.letter');
letters.forEach(letter => letter.addEventListener('transitionend', removeTransition));

window.addEventListener('keydown', playSound);

