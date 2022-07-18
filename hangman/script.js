const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const finalMessageRevealWord = document.getElementById('final-message-reveal-word');

const figureParts = document.querySelectorAll('.figure-part');

const words = ['application', 'programming', 'interface', 'wizard'];

let selectedWord = words[Math.floor(Math.random() * words.length)];

let playable = true;

const correctLetters = [];
const wrongLetters = [];

//显示隐藏的 word
function displayWord() {
    wordEl.innerHTML = `
        ${
            selectedWord
                .split('')
                .map(
                    letter =>`
                    <span class="letter">
                        ${correctLetters.includes(letter) ? letter : ''}
                    </span>
                `)
                .join('')
        }`;

    const innerWord = wordEl.innerText.replace(/[ \n]/g, '');

    if(innerWord === selectedWord) {
        finalMessage.innerText = 'Congratulations! You won! 😃';
		popup.style.display = 'flex';

		playable = false;
    }
        
}

//更新输入的字母
function updateWrongLettersEl() {
    //显示错误的字母
    wrongLettersEl.innerHTML = `
        ${wrongLetters.length > 0 ?  '<p>Wrong</p>' : ''}
        ${wrongLetters.map(letter => `<span>${letter}</span>`)}
    `;

    //显示部分身体
    figureParts.forEach((part,index) => {
        const errors = wrongLetters.length;

        if(index<errors) {
            part.style.display = 'block';
        }else {
            part.style.display = 'none';
        }
    });

    //检查是否失败
    if(wrongLetters.length === figureParts.length) {
        finalMessage.innerText = 'Unfortunately you lost. 😕';
		finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
		popup.style.display = 'flex';

		playable = false;
    }
}

//显示提示信息
function showNotification() {
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    },2000);
}

window.addEventListener('keydown', e => {
    if(playable) {
        console.log(e.code);
        // debugger;
        if(e.keyCode >= 65 && e.keyCode <= 90) {
            const letter = e.key.toLocaleLowerCase();

            if(selectedWord.includes(letter)) {
                if(!correctLetters.includes(letter)) {
                    correctLetters.push(letter);

                    displayWord();
                }else {
                    showNotification();
                }
            }else {
                if(!wrongLetters.includes(letter)) {
                    wrongLetters.push(letter);

                    updateWrongLettersEl();
                }else {
                    showNotification();
                }
            }
        } 
    }
});

//再来一次
playAgainBtn.addEventListener('click', ()=> {
    playable = true;

    correctLetters.splice(0);
    wrongLetters.splice(0);

    selectedWord = words[Math.floor(Math.random() * words.length)];

    displayWord();

	updateWrongLettersEl();

	popup.style.display = 'none';
});

displayWord();