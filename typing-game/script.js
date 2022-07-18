const settingsBtn = document.querySelector('#settings-btn');
const settings = document.querySelector('#settings');
const difficulty = document.querySelector('#difficulty');
const timer = document.querySelector('#time');
const scorer = document.querySelector('#score');
const word = document.querySelector('#word');
const text = document.querySelector('#text');
const endGameContainer = document.querySelector('#end-game-container');
const endScore = document.querySelector('#end-score');
const reloadBth = document.querySelector('section button');


const words = [
    'sigh',
    'tense',
    'airplane',
    'ball',
    'pies',
    'juice',
    'warlike',
    'bad',
    'north',
    'dependent',
    'steer',
    'silver',
    'highfalutin',
    'superficial',
    'quince',
    'eight',
    'feeble',
    'admit',
    'drag',
    'loving'
  ];

//初始倒计时为 10 秒
let time=10, score=0;
const EASY=1, MEDIUM=2, HARD=3;
let randomIndex, level;
const plusSeconds = [,5,3,2];


//随机单词下标
function random() {
    return Math.floor(words.length * Math.random());
}

//设置面板显示的切换
function toggleSettings() {
    settings.classList.toggle('show');
}

//模式选择
function selectLevel(e) {
    switch(e.target.value){
        case 'esay':
            level = EASY;
            break;
        case 'medium':
            level = MEDIUM;
            break;
        case 'hard':
            level  = HARD;
            break;
        default:
            level = EASY;
    }
    localStorage.setItem('level', level);
}

function updateLevelDom() {
    let levelStr;
    level = +localStorage.getItem('level');
    switch(level) {
        case 1:
            levelStr = 'easy';
            break;
        case 2:
            levelStr = 'medium';
            break;
        case 3:
            levelStr = 'hard';
            break;
        default: 
            levelStr = 'easy'; 
    }
    difficulty.value=levelStr;
}


//倒计时界面刷新
function updateTimeDom() {
    timer.innerText = time;
}


//分数界面刷新
function updateScoreDom() {
    scorer.innerText = score;
}

//更新单词DOM
function updateWordDom() {
    randomIndex = random();
    word.innerText = words[randomIndex];
}

//游戏结束显示界面
function gameOver() {
    endGameContainer.classList.remove('noshow'); 
    endScore.innerText = score;
}

//开始计时，计时结束游戏over
function gameInterval() {
    let intervalId = setInterval(() => {
        time --;
        updateTimeDom();
        if(time === 0) {
            clearInterval(intervalId);
            gameOver();
        }
    },1000);
}

function calculate(e) {
    if(e.target.value === words[randomIndex]) {
        score += level;
        updateScoreDom();
        time += plusSeconds[level];
        updateTimeDom();
        e.target.value = '';
        randomIndex = random();
        updateWordDom();
    }
}


function initGame() {
    updateLevelDom();
    updateTimeDom();
    updateScoreDom();
    updateWordDom();
    
    gameInterval();


}



initGame();
text.focus();

settingsBtn.addEventListener('click', toggleSettings);
difficulty.addEventListener('change', selectLevel);
text.addEventListener('input',calculate);
reloadBth.addEventListener('click', () => location.reload());
