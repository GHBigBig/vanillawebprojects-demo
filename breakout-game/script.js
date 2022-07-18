const canvas =  document.querySelector('#canvas');
const rulesBtn= document.querySelector('#rules-btn');
const rulesDiv = document.querySelector('#rules');
const closeBtn = document.querySelector('#close-btn');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;    //一行里的砖头的个数
const brickColumnCount = 5; //一列里的
const delay = 500;  //重新开始游戏的延迟

//球的属性
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4,
    visible: true
};

//创建球拍属性
const paddle = {
    x: canvas.width/2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
    visible: true
};

//创建砖块的属性
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};

//创建砖块
const bricks = [];
for(let i=0; i<brickRowCount; i++) {
    bricks[i] = [];
    for(let j=0; j<brickColumnCount; j++) {
        const x = i * (brickInfo.w+brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h+brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = {x, y, ...brickInfo};
    }
}

//绘画砖块
function drawBricks() {
    bricks.forEach(column=>{
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

//绘画球拍
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = paddle.visible ? '#0095dd' : 'transparent';
    ctx.fill();
    ctx.closePath();
}

//绘画球
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, 2*Math.PI);
    ctx.fillStyle = paddle.visible ? '#0095dd' : 'transparent';
    ctx.fill();
    ctx.closePath();
}

//画出分数
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//移动球拍
function movePaddle() {
    paddle.x += paddle.dx;

    //墙壁检测
    if(paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }
    if(paddle.x < 0) {
        paddle.x = 0;
    }
}

//移动小球
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    //左右墙壁碰撞后改变水平方向
    if(ball.x + ball.size > canvas.width || ball.x-ball.size < 0) {
        ball.dx *= -1;
    }
    //上下墙壁碰撞后改变垂直方向   下墙壁检测，直接结束游戏并重新开始
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    //球拍碰撞检测
    if(ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w && ball.y + ball.size > paddle.y){
        //ball.dy *= -1;
        console.debug(`ball.dy:${ball.dy}, ball.speed:${ball.speed}`)
        ball.dy = -ball.speed; //?????????????
    }

    //砖块碰撞检测
    bricks.forEach(column=>{
        column.forEach(brick => {
            // console.debug(`brick.visible:${brick.visible}`);
            if(brick.visible) {
                if(
                    ball.y - ball.size < brick.y + brick.h &&   //球的上边界比砖块的下边界更高 
                    ball.y + ball.size > brick.y &&  //球的下边界比砖块的上边界更低 限制打破的块数
                    ball.x - ball.size > brick.x &&  //球的左边界比砖块的左边界更靠右
                    ball.x + ball.size < brick.x + brick.w  //球的右边界比砖块的有边界更靠左
                ){
                    console.debug('income...');
                    ball.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
            }
        });
    });

    //撞到下面的墙游戏就是输了，游戏重新开始
    if(ball.y + ball.size > canvas.height) {
        showAllBricks();
        score = 0;
    }
}

//处理分数
function increaseScore() {
    score++;
    if(score % (brickColumnCount * brickRowCount) === 0) {  //所有的砖块都被撞烂
        ball.visible = false;
        paddle.visible = false;

        //0.5 秒后重新开始游戏
        setTimeout(() => {
            showAllBricks();
            score = 0;
            paddle.x = canvas.width / 2- 40;
            paddle.y = canvas.height - 20;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.visible = true;
            paddle.visible = true;
        }, delay);
    }
}

//显示所有的砖块
function showAllBricks() {
    bricks.forEach(col => {
        col.forEach(brick => {
            brick.visible = true;
        });
    });
}

//绘画所有的元素
function draw() {
    //清楚画布上的所有元素
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawPaddle();
    drawBall();
    drawScore();
}

//更新画布和动画
function update() {
    movePaddle();
    moveBall();
    draw();

    requestAnimationFrame(update);
}

update();




rulesBtn.addEventListener('click', () => {
    rulesDiv.classList.add('show');
});
closeBtn.addEventListener('click', () => {
    rulesDiv.classList.remove('show');
});

document.addEventListener('keydown', (e) => {
    if(e.key ==='Right' || e.key  === 'ArrowRight') {
        paddle.dx = paddle.speed;
    }else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
});
document.addEventListener('keyup', (e) => {
    if(e.key === 'Right' ||  e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
});


