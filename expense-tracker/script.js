const text = document.querySelector('#text');
const amount = document.querySelector('#amount');
const list = document.querySelector('#list');
const moneyPlus = document.querySelector('#money-plus');
const moneyMinus = document.querySelector('#money-minus');
const total = document.querySelector('h1');
const btn = document.querySelector('form button.btn');


const dom = new Proxy({},{
    get(target, property) {
        /**
         * attrs: 属性配置对象
         * children: 只能写字符串，或者 dom.xxx
         */
        return function(attrs={}, ...children) {
            const el = document.createElement(property);
            for(let prop of Object.keys(attrs)) {
                el.setAttribute(prop, attrs[prop]);
            }
            for(let child of children) {
                if(typeof child === 'string') {
                    child = document.createTextNode(child);
                }
                el.appendChild(child);
            }
            return el;
        }
    }
})

let datas = [];


function addTransaction() {
    let textValue = text.value;
    let amountValue = amount.value;

    datas.push([textValue, amountValue]);

    localStorage.setItem('datas', JSON.stringify(datas));

    addTransactionDOM(textValue, amountValue);
}


function addTransactionDOM(textValue, amountValue) {
    appendLi(textValue, amountValue);

    updateTotalMoneyDOM();

    clearForm();
}



function updateTotalMoneyDOM(){
    let {tmpTotalMoney:totalMoney, 
            tmpPlusTotal:plusTotal, 
            tmpMinusTotal:minusTotal } = calculateAllKindsMoney();
       
    moneyPlus.innerText = plusTotal.toLocaleString('en-us', {style:'currency', currency:'USD'});
    moneyMinus.innerText = minusTotal.toLocaleString('en-us', {style:'currency', currency:'USD'});
    total.innerText = totalMoney.toLocaleString('en-us', {style:'currency', currency:'USD'});
}

function calculateAllKindsMoney(){
    let datas = JSON.parse(localStorage.getItem('datas')) ?? [];
    let tmpPlusTotal = 0;
    let tmpMinusTotal = 0;
    let tmpTotalMoney = 0;
    datas.forEach(data => {
        if(+data[1] > 0) {
            tmpPlusTotal += +data[1];
        }else {
            tmpMinusTotal += +data[1];
        }
        tmpTotalMoney += +data[1];
    });
    return {tmpTotalMoney, tmpPlusTotal, tmpMinusTotal};
}

function appendLi(textValue, amountValue) {
    let liClassName,amountValueStr;
    
    if(+amountValue > 0 )  {
        liClassName = 'plus';
        amountValueStr = '+'+ amountValue;
    }else {
        liClassName = 'minus';
        amountValueStr = ''+ amountValue;
    }

    const li = dom.li({class: liClassName}, 
        textValue, 
        dom.span({}, amountValueStr), 
        dom.button({class: 'delete-btn'}, 'x'));

    li.addEventListener('click', e => {
        e.composedPath()[1]?.remove();
        //这里仅删除UI，删除数据需要给每条数据加个 ID 这里不去实现
    });
    list.appendChild(li);
}

function clearForm() {
    text.value = null;
    amount.value = null;
}

function populateUI() {
    let datas = JSON.parse(localStorage.getItem('datas'));

    console.log('datas: ', datas);


    if(datas){
        
        datas.forEach(data => appendLi(data[0], data[1]) );
        clearForm();

        updateTotalMoneyDOM()
    }
    
}



btn.addEventListener('click', (e) => {
    e.preventDefault();

    if(text.value.trim() && amount.value) {
        addTransaction();
        
    }else {
        alert('Please add a text and amount');
    }

});


window.onload = () => {
    populateUI();
    datas = JSON.parse(localStorage.getItem('datas')) ?? [];
}