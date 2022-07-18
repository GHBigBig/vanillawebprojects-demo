const video = document.querySelector('#video');
const play = document.querySelector('#play');
const stop = document.querySelector('#stop');
const progress = document.querySelector('#progress');
const timestamp = document.querySelector('#timestamp');

/**
 * 切换视频播放状态
 */
function toggleVideoStatus() {
    if(video.paused) {
        video.play();
    }else {
        video.pause();
    }
}

/**
 * 停止播放，进度条调整为 0
 */
function stopVideo() {
    video.currentTime = 0;
    video.pause();
}

/**
 * 更新视频进度条并且更新时间戳
 */
function updateVideoProgress() {
    progress.value = (video.currentTime / video.duration) * 100;

    let mins = Math.floor(video.currentTime / 60);
    if(mins < 10) {
        mins = '0' + mins;
    }

    let secs = Math.floor(video.currentTime % 60);
    if(secs < 10) {
        secs = '0' + secs;
    }
    
    timestamp.innerHTML =  `${mins}:${secs}`;
}

/**
 * 点击视频进度条控制视频播放进度
 */
function setVideoProgress() {
    video.currentTime = (+progress.value * video.duration) / 100;
}

/**
 * 
 */
function updateVideoIcon() {
    if(video.paused) {
        play.innerHTML = '<i class="fa fa-play fa-2x"></i>';
    }else {
        play.innerHTML =  '<i class="fa fa-pause fa-2x"></i>';
    }
}


play.addEventListener('click', toggleVideoStatus);
stop.addEventListener('click', stopVideo);
// progress.addEventListener('click', updateVideoProgress);

progress.addEventListener('change', setVideoProgress);

video.addEventListener('timeupdate', updateVideoProgress);
video.addEventListener('pause', updateVideoIcon);
video.addEventListener('play', updateVideoIcon);
video.addEventListener('click', toggleVideoStatus);
