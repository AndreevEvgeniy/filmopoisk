//АВТОРИЗАЦИЯ
//имя авторизованного пользователя
let currentUser = "";
//массив данных пользователей
let usersBase = [];
//избранное текущего пользователя
let currentFavorite = [];
//индекс в масиве авторизованного пользователя
let currentUserIndex;

//html элементы
const authorizationFalseItems = document.querySelectorAll(".autohorize-false");
const authorizationTrueItems = document.querySelectorAll(".autohorize-true");
const userNameField = document.getElementById("username");

function getUserData() {
  //получаем значение текщего пользователя из localStorage, прасим json, помещаем userBase, если оно сущетсвует
  let currentUserJSON = localStorage.getItem("currentUser");
  if (currentUserJSON) {
    currentUser = JSON.parse(currentUserJSON);
  }
  let usersJSON = localStorage.getItem("users");
  if (usersJSON) {
    usersBase = JSON.parse(usersJSON);
  }

  //находим индекс текущего пользователя в массиве всех пользователей
  currentUserIndex = usersBase.findIndex(
    (user) => user.username === currentUser
  );
  //если индекс найден, запоминаем избранное пользователя в отдельную переменную
  if (currentUserIndex !== -1) {
    currentFavorite = usersBase[currentUserIndex].favorite
      ? usersBase[currentUserIndex].favorite
      : [];
  }
}

//отображем информацию в хэдере
function showUserInfo() {
  if (currentUser) {
    //если пользователь авторизован
    authorizationFalseItems.forEach((item) => item.classList.add("hidden"));
    authorizationTrueItems.forEach((item) => item.classList.remove("hidden"));
    userNameField.textContent = currentUser;
  } else {
    //без авторизации
    authorizationFalseItems.forEach((item) => item.classList.remove("hidden"));
    authorizationTrueItems.forEach((item) => item.classList.add("hidden"));
  }
}

getUserData();
showUserInfo();

// ИЗБРАННОЕ

const listElement = document.querySelector(".list");

//устанавливаем слушатель на клик на список фильмов
listElement.addEventListener("click", listClickHandler);

//функция обработчик
function listClickHandler(event) {
  //продолжаем выполнение, если кликнули на кнопку избранного
  const btn = event.target.closest(".favorite-btn");
  if (!btn) {
    return;
  }

  //если не пользователь не авторизован, то показываем окно с требованием авторизоваться
  if (!currentUser) {
    alert(
      "Для добавления в избранное зарегистрируйтесь или войдите в аккаунт!"
    );
    return;
  }

  //получаем ID фильма из дата-атрибута кнопки
  const filmId = +btn.dataset.id;
  //ищем индекс фильма в массиве избранного по взятому ID
  const index = currentFavorite.indexOf(filmId);
  if (index !== -1) {
    //если фильм обнаружен в избранном - меяем картинку и удалем данный фильм из массива избранных фильмов
    btn.querySelector("img").src = "./img/favorite-false.png";
    currentFavorite.splice(index, 1);
  } else {
    //если фильм обнаружен в избранном - меяем картинку и добавляем данный фильм в массив избранных фильмов
    btn.querySelector("img").src = "./img/favorite-true.png";
    currentFavorite.push(filmId);
  }

  //обновляем значение списка избранного текузего пользователя в общей базе пользователей
  usersBase[currentUserIndex].favorite = [...currentFavorite];
  //обновляем данные в localStorage
  localStorage.setItem("users", JSON.stringify(usersBase));
}

let currentFilmArray = [...filmArray];

const listField = document.querySelector(".list");
//перевод массива объектов в строку
function arrayToString(array, key, separator = ", ") {
  return array.map((item) => item[key]).join(separator);
}

//Отрисовка списка фильмов по массиву
function listRender(filmArray) {
  let listHTMLString = ``;
  //Если фильмы по данным параметрам не обнаружены - выводим сообщение
  if (filmArray.length === 0) {
    listHTMLString = `<p>Фильмов с подобными параметрами не найдено!</p>`;
    listField.innerHTML = listHTMLString;
    currentFilmArray = [...filmArray];
    return;
  }
  //создаем строку html кода для каждого отображемого фильма из массива, добавляя нужные значения из базы
  filmArray.forEach((film) => {
    listHTMLString =
      listHTMLString +
      `<div class="list-item film">
              <div class="film-content">
                <img
                  class="item-img"
                  src="${film.posterUrl}"
                  alt=""
                />
                <div class="film-info">
                  <a href="./film#${film.filmId}" class="film-title">${
        film.nameRu
      }</a>
                  <div class="film-info-row">
                    <p>Год выпуска: <span class="year">${film.year}</span></p>
                    <p>Жанр: <span class="genre">${arrayToString(
                      film.genres,
                      "genre"
                    )}</span></p>
                    <p>
                      Продолжительность: ${film.filmLength}
                    </p>
                    <p>Страна: <span class="genre">${arrayToString(
                      film.countries,
                      "country"
                    )}</span></p>
                  </div>
                </div>
              </div>
              <div class="favorite">
                <button class="favorite-btn" data-id="${film.filmId}">
                  <img src="./img/favorite-${
                    currentFavorite.includes(+film.filmId) ? "true" : "false"
                  }.png" alt="" />
                </button>
              </div>
            </div>`;
  });
  listField.innerHTML = listHTMLString;
}

//обновить список фильмов, учитывая все опции (поиск, фильтры, сортировка)
function refreshList() {
  currentFilmArray = [...filmArray];
  for (const key in filterState) {
    filterItem = filterState[key];

    if (filterItem.value !== "") {
      filterByKey(
        currentFilmArray,
        filterItem.key,
        filterItem.value,
        filterItem.format
      );
    }
  }
  if (sortState.key !== "") {
    sortByKey(currentFilmArray, sortState.key, sortState.order);
  }
  if (searchState.searchReq !== "") {
    serachFilm(searchState.searchReq);
  }
  listRender(currentFilmArray);
}

//сортировка

const sortState = { key: "", order: "" };

const searchState = { searchReq: "" };

//объект состояния фильтров
const filterState = {
  year: { key: "year", value: "", format: "" },
  genres: {
    key: "genres",
    value: "",
    format: "",
  },
  countries: { key: "countries", value: "", format: "" },
  filmLengthMinute: { key: "filmLengthMinute", value: "", format: "" },
  favorite: { key: "favorite", value: false, format: "favorite" },
};

//Универсальная функция сортировки массива объектов по ключу
function sortByKey(array, key, order = "asc") {
  sortState.key = key;
  sortState.order = order;
  if (key === "") {
    refreshList();
    return;
  }
  currentFilmArray.sort((a, b) => {
    if (typeof a[key] === "string") {
      return order === "asc"
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    }
    return order === "asc" ? a[key] - b[key] : b[key] - a[key];
  });
  listRender(currentFilmArray);
}

//Обработчик события выбора фильтров

function inputChangeHandler(event) {
  let value;
  let key;
  //получаем данные из чекбокса "избранное"
  if (event.target.type === "checkbox") {
    value = event.target.checked;
    format = "favorite";
    key = event.target.name;
    filterState[key] = {
      key: key,
      format: format,
      value: value,
    };
    refreshList();
    return;
  }
  //из input получаем value - выбранное значение фильтра, key - параметр, по которому произойдет фильтрация
  value = event.target.value;
  key = event.target.name;

  // значение в форме представлено в формате: "значение,тип_данных"
  //типы данных: строка, число, числовой диапазон
  //делим строку по запятой, для разделения значений
  value = value.split(",");
  format = value[1];
  value = value[0];

  //Если формат - диапазон данных (он представлен в виде строки "начало-конец")
  //делим строку по символу "-" и помещаем значения в объект
  if (format === "range" && value !== "") {
    let arrayValue = value.split("-");
    value = {
      startValue: arrayValue[0],
      endValue: arrayValue[1],
    };
  }
  //собранные данные помещаем в обект состояния фильтров
  filterState[key] = {
    key: key,
    format: format,
    value: value,
  };

  //запускаем функцию обновления списка
  refreshList();
}

//Универсальная функция фильтрации массива объектов
function filterByKey(array, key, value, format) {
  //если получили пустое значение фильтра, не выполняем филтрацию
  if (value === "" || value === false) {
    return;
  }
  //в зависимости от формата выполняем фильтрацию массива

  switch (format) {
    case "string":
      //данные страны и жанр представлены сложной структурой, поэтому производим углубленную фильтрацию
      //методом filter перебираем массив фильмов, и получаем новый массив, который состоит
      //только из элементов, в которых есть совпадение по данному ключу и значению.
      currentFilmArray = array.filter((film) => {
        return film[key].some((item) => {
          return (
            item[key === "countries" ? "country" : "genre"].toLowerCase() ===
            value.toLowerCase()
          );
        });
      });

      break;
    case "number":
      //фильтруем массив по ключу и значению
      currentFilmArray = array.filter((film) => {
        return +film[key] === +value;
      });
      break;
    case "range":
      //фильтруем массив по ключу и диапазону
      currentFilmArray = array.filter(
        (film) => +film[key] >= value.startValue && +film[key] <= value.endValue
      );
      break;
    case "favorite":
      currentFilmArray = array.filter((film) => {
        return currentFavorite.includes(film.filmId);
      });

      break;
    default:
      break;
  }
}

const sortInput = document.getElementById("sort");
const filtersInputs = document.querySelectorAll(".filter");

//сортировка фильмов при выборе
sortInput.addEventListener("change", (event) => {
  let sortOption = event.target.value;
  sortOption = sortOption.split(",");
  sortByKey(filmArray, sortOption[0], sortOption[1]);
});

//Фильтрация фильмов при выборе значения фильтра
filtersInputs.forEach((filterInput) => {
  //устанавливаем слушатели события Change на формы ввода(select)
  filterInput.addEventListener("change", inputChangeHandler);
});

//ПОИСК ФИЛЬМОВ

const searchFiled = document.getElementById("search-field");
const searchBtn = document.getElementById("search-btn");
const searchForm = document.getElementById("search-form");

function serachFilm(searchReq) {
  //заполняем переменную состояния поиска поисковым запросом
  searchState.searchReq = searchReq;
  if (currentFilmArray.length === 0) {
    currentFilmArray = [...filmArray];
  }
  //если пустой запрос обновляем лист
  if (searchReq === "") {
    refreshList();
    return;
  }
  //выполняем поиск фильмов по базе
  currentFilmArray = currentFilmArray.filter((film) =>
    film.nameRu.toLocaleLowerCase().includes(searchReq)
  );

  listRender(currentFilmArray);
}

//слушатель на submit на поисковой форме
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchReq = searchFiled.value.toLowerCase();
  serachFilm(searchReq);
});

listRender(currentFilmArray);
