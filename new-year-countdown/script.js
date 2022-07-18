const year = document.querySelector('#year');
const days = document.querySelector('#days');
const hours = document.querySelector('#hours');
const minutes = document.querySelector('#minutes');
const seconds = document.querySelector('#seconds');

let date = new Date();
let nextYear = date.getFullYear() + 1;

let nextYearDateTime = new Date(nextYear, 0);

year.innerHTML = nextYear;

setInterval(() => {
    let dayValue = Math.floor((nextYearDateTime-Date.now()) / (1000*60*60*24));
    days.innerHTML = dayValue<10 ? '0'+dayValue : dayValue;

    let hoursValue = Math.floor((nextYearDateTime-Date.now()) % (1000*60*60*24) / (1000*60*60));
    hours.innerHTML = hoursValue<10 ? '0'+hoursValue : hoursValue;

    let minutesValue = Math.floor((nextYearDateTime-Date.now()) % (1000*60*60) / (1000*60))
    minutes.innerHTML = minutesValue<10 ? '0'+minutesValue : minutesValue;

    let secondsValue = Math.floor((nextYearDateTime-Date.now()) % (1000*60) / (1000));
    seconds.innerHTML = secondsValue<10 ? '0'+secondsValue : secondsValue;
}, 1000);


