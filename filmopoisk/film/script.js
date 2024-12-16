//необходимые html элемнеты
const userNameFields = document.querySelectorAll(".username");
const filmField = document.querySelector(".film-field");

//перевод массива объектов в строку
function arrayToString(array, key, separator = ", ") {
  return array.map((item) => item[key]).join(separator);
}

let currentUser;

//получаем данные о пользователях из localStorage
function getUserData() {
  let currentUserJSON = localStorage.getItem("currentUser");
  if (currentUserJSON) {
    currentUser = JSON.parse(currentUserJSON);
  }
}

//отображаем логин пользователя в шапке
function showUserInfo() {
  userNameFields.forEach((filed) => {
    filed.textContent = currentUser;
  });
}

//получаем id фильма для данной страницы из URL
let filmId = window.location.hash;
filmId = +filmId.slice(1, filmId.length);
let filmDescription = "";

//ищем фильм в массиве фильмов с данным id
const film = filmArray.find((item) => item.filmId === filmId);

//через kinopoiskapiunofficial API с помощью fetch запроса получаем данные о фильме
async function getDescription() {
  try {
    const response = await fetch(
      `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": "6f2a9b5c-b5c3-44e0-87c6-1db89d2169e9",
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      //обработка ошибок
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    //получаем описание фильма
    filmDescription = data.description;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  //вызываем функцию отрисовки элементов страницы
  filmRender(film);
}

getDescription();

//рендер страницы. Создаем строк с html кодом, в который внедряем данные из объекта film и полученное описание
function filmRender(film) {
  let filmHTMLString = ``;
  filmHTMLString = `<div class="film">
              <div class="film-content">
                <img
                  class="item-img"
                  src="${film.posterUrl}"
                  alt=""
                />
                <div class="film-info">
                  <h1 class="film-title">${film.nameRu}</h1>
                  <div class="film-info-row">
                    <p>Год выпуска: <span class="year">${film.year}</span></p>
                    <p>Жанры: <span class="genre">${arrayToString(
                      film.genres,
                      "genre"
                    )}</span></p>
                    <p>
                      Продолжтельность: ${film.filmLength}
                    </p>
                    <p>Страна: <span class="genre">${arrayToString(
                      film.countries,
                      "country"
                    )}</span></p>
                  </div>
                  <h2>Описание</h2>
                  <p>${filmDescription}</p>
                </div>
              </div>
              
            </div>`;
  //помещаем готовую строку в html страницу
  filmField.innerHTML = filmHTMLString;
}

getUserData();
showUserInfo();
