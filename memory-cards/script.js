const addNewCardBtn  = document.querySelector('.btn.add');
const addContainer = document.querySelector('#add-container');
const hideBtn = document.querySelector('#hide');
const questionTestArea = document.querySelector('#question');
const answerTestArea = document.querySelector('#answer');
const addCardBtn = document.querySelector('#add-card');
const container = document.querySelector('.container');
const nowIndexSpan = document.querySelector('#nowIndex');
const totalIndexSpan = document.querySelector('#totalIndex');
const preBtn = document.querySelector('#pre');
const nextBtn = document.querySelector('#next');
const clearBtn = document.querySelector('#clear');


class QueAns {
    question;
    answer;

    constructor(que='', ans='') {
        this.question = que;
        this.answer= ans;
    }
}
let datas = [];
let nowIndex=0,totalIndex = 0;

const dom = new Proxy({}, {
    get(target, propety) {
        return function(attrs={}, ...children) {
            const el = document.createElement(propety);

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
        };
    }
});

function generateQueAns() {
    const queAns = new QueAns(questionTestArea.value, answerTestArea.value);
    
    
    datas.push(queAns);
    localStorage.setItem('datas', JSON.stringify(datas));
    populateUI();
    hideAddContainer();
}

//先清空 container 中的东西在去渲染 datas 的数据
function populateUI() {
    datas = JSON.parse(localStorage.getItem('datas') ?? '[]');
    totalIndex=0;

    container.innerHTML = '';
    datas?.forEach((queAns,index) => {
        let containerCL = '';
        if(index === 0) {
            containerCL = 'cards active';
            nowIndex = 1;
        }else {
            containerCL = 'cards right';
        }
        const el = dom.div(
            {class: containerCL},
            dom.div(
                {class: 'card-front'},
                dom.p(undefined, `${queAns.question}`),
            ),
            dom.div(
                {class: 'card-back'},
                dom.p(undefined, `${queAns.answer}`),
            ),
        );
        //问题答案上下翻转
        el.addEventListener('click', () => el.classList.toggle('show-answer'));

        container.appendChild(el);
        // debugger
        totalIndex++;
    });

    updateNavDom();
}

function updateNavDom() {
    nowIndexSpan.innerText = nowIndex;
    totalIndexSpan.innerText = totalIndex;
}

//只有再当前元素有下一个元素时才可以调用
function nextNav() {
    for(let i=0; i < container.children.length; i++) {
        if (container.children[i].classList.contains('active')) {
            container.children[i].classList.remove('active');
            container.children[i].classList.add('left');
            if (container.children[i].classList.contains('show-answer')) {
                container.children[i].classList.remove('show-answer');
            }

            i += 1;
            container.children[i].classList.remove('right');
            container.children[i].classList.add('active');

            nowIndex += 1;
            updateNavDom();
            break;
        }
    }
}

//只有再当前元素有上一个元素时才可以调用
function preNav() {
    for(let i=container.children.length-1; i >= 0; i--) {
        if (container.children[i].classList.contains('active')) {
            container.children[i].classList.remove('active');
            container.children[i].classList.add('right');
            if (container.children[i].classList.contains('show-answer')) {
                container.children[i].classList.remove('show-answer');
            }

            i -= 1;
            container.children[i].classList.remove('left');
            container.children[i].classList.add('active');

            nowIndex -= 1;
            updateNavDom();
            break;
        }
    }
}

function hideAddContainer() {
    addContainer.classList.remove('show');
}

addNewCardBtn.addEventListener('click', () => addContainer.classList.add('show'));
hideBtn.addEventListener('click', hideAddContainer);
addCardBtn.addEventListener('click', generateQueAns);
nextBtn.addEventListener('click',  () => {
    if(totalIndex - nowIndex >= 1) {
        nextNav();
    }
});
preBtn.addEventListener('click',  () => {
    if(totalIndex>=2 && nowIndex > 1) {
        preNav();
    }
});
clearBtn.addEventListener('click', () => {
    datas = [];
    localStorage.setItem('datas', JSON.stringify(datas));
    nowIndex = 0;
    totalIndex = 0;
    populateUI();
});


populateUI();