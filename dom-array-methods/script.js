const main = document.getElementById('main');
const addUserBtn = document.getElementById('add-user');
const doubleBtn = document.getElementById('double');
const showMillionairesBtn = document.getElementById('show-millionaires');
const sortBtn = document.getElementById('sort');
const calculateWealthBtn = document.getElementById('calculate-wealth');

let users = [];  //存放用户



getRandomUser();

//使用观察者模式监听 用户 的变化自动更新 DOM
const queuedObservers = new Set();

const observe = (fn) => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
    let result = Reflect.set(target, key, value, receiver);
    queuedObservers.forEach(observer => observer());
    return result;
}

let res = {data: observable(users)};
let resProxy = observable(res);
observe(updateDOM);



/**
 * 异步获取随机用户数据并添加随机钱数
 */
async function getRandomUser() {
    const res = await fetch('https://randomuser.me/api');
    const data = await res.json();

    const user = data.results[0];

    const newUser = {
        name: `${user.name.first} ${user.name.last}`,
        money: Math.floor(Math.random() * 1000000)
    };

    addData(newUser);
}

/**
 * 更新 DOM
 * @param {数组} providadData 用户
 */
function updateDOM(providadData = resProxy.data) {
    main.innerHTML = '<h2><strong>Person</strong> Wealth</h2>';

    providadData.forEach(item => {
        const element = document.createElement('div');
        element.classList.add('person');
        element.innerHTML = 
            `<strong>${item.name}</strong> ${item.money.toLocaleString('en-US',{style:'currency', currency:'USD'})}`;
        main.appendChild(element);
    });
}

/**
 * 保存用户并且更新 DOM
 * @param {用户} user 用户
 */
function addData(user) {
    resProxy.data.push(user);

    // updateDOM(data);
}

/**
 * 金钱翻倍
 */
function doubleMoney()  {
    resProxy.data = resProxy.data.map(user => {
        // 扩展运算符，如果用户自定义的属性，放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖掉
        return {...user, money: user.money * 2}
    });

    // updateDOM();
}

/**
 * 排序，有钱的排前面
 */
function sortByRichest(){
    //返回值大于0 表示第一个在第二个后面
    resProxy.data.sort((a,b) => b.money - a.money);

    // updateDOM();
}

/**
 * 只显示百万富翁
 */
function showMillionaires() {
    resProxy.data = resProxy.data.filter(user =>  user.money > 1000000);

    // updateDOM();
}

/**
 * 计算总钱数
 */
function calculateWealth() {
    const wealth = resProxy.data.reduce((acc, user) => (acc += user.money), 0);

    const wealthEL = document.createElement('div');
    wealthEL.innerHTML = 
        `<h3>Total Wealth: <strong>${wealth.toLocaleString('en-US',{style:'currency', currency:'USD'})}`;
    main.appendChild(wealthEL);
}

addUserBtn.addEventListener('click', getRandomUser);
doubleBtn.addEventListener('click', doubleMoney);
sortBtn.addEventListener('click', sortByRichest);
showMillionairesBtn.addEventListener('click', showMillionaires);
calculateWealthBtn.addEventListener('click', calculateWealth);
