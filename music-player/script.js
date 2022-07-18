const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const musicInfo = document.getElementById('music-info');

// 歌曲的名称
const songs = ['起风了', 'hey', 'summer', 'ukulele', ];
let songIndex = 0;

/**
 * 载入歌曲
 * @param {String} song 
 */
function loadSong(song = 'error') {
    title.innerText = song;
    audio.src = `./music/${song}.mp3`;
    cover.src = `./images/${song}.jpg`;
    cover.alt = song;
}

function palySong() {
    musicInfo.classList.remove('no-play');
    cover.classList.remove('no-play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');

    audio.play();
}

function pauseSong() {
    musicInfo.classList.add('no-play');
    cover.classList.add('no-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    playBtn.querySelector('i.fas').classList.add('fa-play');

    audio.pause();
}

function updateProgress(e) {
    const {duration, currentTime} = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

//手动设置进度条
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX/width) * duration;
}

function nextSong() {
    songIndex = ++songIndex%songs.length;
    loadSong(songs[songIndex]);
    palySong();
}

function prevSong() {
    songIndex = --songIndex%songs.length;
    if(songIndex < 0) {
        songIndex = songIndex+songs.length;
    }
    loadSong(songs[songIndex]);
    palySong();
}


loadSong(songs[songIndex]);



playBtn.addEventListener('click', () => {
    
    if(!audio.paused) {
        pauseSong();
    }else {
        palySong();
    }
});
//更新进度条
audio.addEventListener('timeupdate', updateProgress);
//点击进度
progressContainer.addEventListener('click', setProgress);

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

//自动播放下一首
audio.addEventListener('ended', nextSong);
