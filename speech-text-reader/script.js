const main = document.querySelector('main');
const voicesEl = document.querySelector('#voices');
const textarea = document.querySelector('textarea');
const read = document.querySelector('#read');
const toggleBtn = document.querySelector('.btn.btn-toggle');
const textBox = document.querySelector('#text-box');
const close = document.querySelector('#close');

const data = [
    {
      image: './img/drink.jpg',
      text: "I'm Thirsty"
    },
    {
      image: './img/food.jpg',
      text: "I'm Hungry"
    },
    {
      image: './img/tired.jpg',
      text: "I'm Tired"
    },
    {
      image: './img/hurt.jpg',
      text: "I'm Hurt"
    },
    {
      image: './img/happy.jpg',
      text: "I'm Happy"
    },
    {
      image: './img/angry.jpg',
      text: "I'm Angry"
    },
    {
      image: './img/sad.jpg',
      text: "I'm Sad"
    },
    {
      image: './img/scared.jpg',
      text: "I'm Scared"
    },
    {
      image: './img/outside.jpg',
      text: 'I Want To Go Outside'
    },
    {
      image: './img/home.jpg',
      text: 'I Want To Go Home'
    },
    {
      image: './img/school.jpg',
      text: 'I Want To Go To School'
    },
    {
      image: './img/grandma.jpg',
      text: 'I Want To Go To Grandmas'
    }
  ];


const dom = new Proxy({}, {
  get(target, property) {
      return function(attrs={}, ...children) {
          const el = document.createElement(property);
          for(let prop of Object.keys(attrs)) {
              el.setAttribute(prop, attrs[prop]);
          }

          for(let child of children) {
            if(typeof child !== 'object') {
              child = document.createTextNode(child);
            }
            el.appendChild(child);
          }

          return el;
      }
    }
  });

data.forEach(item => {
  let prefix = `${item.image}`.match
  const boxEl = dom.figure(
    {class: 'box'}, 
    dom.img({src: `${item.image}`,  srcset: `${item.image}, ./img/uncompressed/${item.image.match(/(.*)\/(.*)/)[2]} 3x`, 
      alt:`${item.text}`}),
    dom.figcaption({class: 'info'}, `${item.text}`)
  );

  boxEl.addEventListener('click', el => {
    setTextMessage(`${item.text}`);
    speakText();

    //添加ui效果
    boxEl.classList.add('active');
    setTimeout(() => boxEl.classList.remove('active'), 800);
  });

  main.appendChild(boxEl);
});


//初始化语音合成器，我觉得是初始化要朗读的文字及相关配置对象
const message = new SpeechSynthesisUtterance();
let voicesData = [];

//设置要说什么话
function setTextMessage(text) {
  message.text = text;
}

//讲话
function speakText() {
  speechSynthesis.speak(message);
}

//获取各种不同的声音
function getVoices () {
  voicesData = speechSynthesis.getVoices();
  voicesData.forEach(voice => {
    voicesEl.appendChild(
        dom.option({value: `${voice.name}`}, `${voice.name} ${voice.lang}`));
  });
}

//设置声音
function setVoice(e) {
  message.voice = voicesData.find(voice => voice.name === e.target.value);
}

//点击按钮都文本框的文字
read.addEventListener('click', () => {
  setTextMessage(textarea.value);
  speakText();
});

//显示 text-box 并且提供给用户不同的声音
toggleBtn.addEventListener('click', () => {
  textBox.classList.toggle('show');
  if(voicesEl.childElementCount === 0) {
    getVoices();
  }
});

//点击  x 关闭弹窗
close.addEventListener('click', ()=>textBox.classList.remove('show'));

//用户改变声音
voicesEl.addEventListener('change', setVoice);
//系统改变声音
speechSynthesis.addEventListener('voiceschanged', getVoices);
