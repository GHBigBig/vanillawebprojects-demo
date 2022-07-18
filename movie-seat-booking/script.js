const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');

/**
 * 将选择电影的信息存储到 localStorage 中
 * @param {*} movieIndex 
 * @param {*} moviePrice 
 */
function setMoiveDate(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

/**
 * 更新选择电影的票数和总金额
 * 将选择位置储存在 Storage 中
 */
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    const seatsIndex = [...selectedSeats].map((item) => [...seats].indexOf(item));

    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));
    
    const selectedSeatsCount = seatsIndex.length;

    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;

}

function populateUI() {
    let selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
    
    if(selectedSeats) {
        [...selectedSeats].forEach(index => {
            seats[index].classList.add('selected');
        });
    }
    
    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');
    if(selectedMovieIndex  !== null) {
        movieSelect.selectedIndex = selectedMovieIndex;
    }
}

//将字符串变为数值 票价
let ticketPrice = +movieSelect.value;

populateUI();

//确定选择的是哪个电影
movieSelect.addEventListener('change', e => {
    ticketPrice = +e.target.value;
    setMoiveDate(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
});

//记录可以选择座位并且更改UI
container.addEventListener('click', e => {
    // console.log(e.target);
    if(
        e.target.classList.contains('seat') && 
        !e.target.classList.contains('occupied')
    ) {
        e.target.classList.toggle('selected');
        

        updateSelectedCount();
    }
});

// Initial count and total set
updateSelectedCount();