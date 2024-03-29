const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');

const rateEl = document.getElementById('rate');
const swap = document.getElementById('swap');

//获取汇率并更新DOM
function calculate() {
    const currency_one = currencyEl_one.value;
    const currency_two = currencyEl_two.value;

    fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
        .then(res => res.json())
        .then(data => {
            console.debug(data);
            const rate = data.rates[currency_two];
            rateEl.innerText = `1 ${currencyEl_one.value} = ${rate} ${currencyEl_two.value}`;
            amountEl_two.value = (amountEl_one.value * rate).toFixed(2);
        });
}

currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', calculate);
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', calculate);

swap.addEventListener('click', ()=> {
    [currencyEl_one.value, currencyEl_two.value] = [currencyEl_two.value, currencyEl_one.value];
    calculate();
});

calculate();