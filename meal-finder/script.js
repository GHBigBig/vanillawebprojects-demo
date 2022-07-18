const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

/**
 * 从 API 搜索美食
 * @param {Event} e 
 */
function searchMeal(e) {
    e.preventDefault();

    //清空单个美食的展示
    single_mealEl.innerHTML = '';

    //获取要搜索的值 清空空白
    const term = search.value.trim();

    if(term) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
               
                resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

                if(data.meals === null) {
                    mealsEl.innerHTML = `<p>There are no search results. Try again!</p>`;
                }else {
                    mealsEl.innerHTML = data.meals.map(
                        meal => `
                            <div class="meal">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                                <div class="meal-info" data-mealID="${meal.idMeal}">
                                    <h3>${meal.strMeal}</h3>
                                </div>
                            </div>
                        `
                    ).join('');
                }
            });

        search.value = '';
    }else {
        alert('Please enter a search term');
    }

}

/**
 * 从 API 中随机获取一美食
 */
function getRandomMeal() {
    //清空搜索所用到的元素内容
    resultHeading.innerHTML = '';
    mealsEl.innerHTML = '';

    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDom(meal);
        })
}

/**
 * 添加食物到 DOM
 * @param {Object} meal 
 */
function addMealToDom(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
            `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
        <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
            ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
        </div>
    `;
}

/**
 * 从 API 中根据 ID 获取食物详情
 * @param {ID} mealID 
 */
 function getMealById(mealID) {
     console.debug(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
        const meal = data.meals[0];

        addMealToDom(meal);
        });
}
  

submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });


  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    console.log(mealID);
    getMealById(mealID.trim());
  }
});