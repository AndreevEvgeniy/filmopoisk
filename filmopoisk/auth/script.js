//html элемнеты для работы скрипта
const authForm = document.getElementById("auth-form");
const usernameInput = document.getElementById("login");
const passwordInput = document.getElementById("password");

const errorField = document.querySelector(".warning");

let usersBase = [];

//получаем из loclaStorage массив с данными о пользователях
function getUsersData() {
  let data = localStorage.getItem("users");
  if (!data) {
    return;
  }
  //парсим из json
  usersBase = JSON.parse(data);
}

//показать ошибку ввода данных
function showError(text) {
  errorField.textContent = text;
}

//убрать ошибку ввода данных
function hideError() {
  errorField.innerHTML = "&nbsp;";
}

//отчистить поле пароля
function clearPassword() {
  passwordInput.value = "";
}
//выполнить авторизацию - записать в localStorage имя пользователя в currentUser
function authorization(authData) {
  localStorage.setItem("currentUser", JSON.stringify(authData.username));
}

getUsersData();

//слушатель и обработчки события 'submit' на форме
authForm.addEventListener("submit", (event) => {
  //предотвращает отправку формы с перезагрузкой страницы
  event.preventDefault();
  //получаем данные из формы
  const authData = {
    username: usernameInput.value,
    password: passwordInput.value,
  };
  checkData(authData);
});

function checkData(authData) {
  //Проверям что все поля не пустые
  for (const key in authData) {
    if (!authData[key]) {
      showError("Заполнены не все поля!");
      return;
    }
  }
  //ищем пользователя с введенным логином в базе
  const user = usersBase.find((user) => {
    return user.username === authData.username;
  });

  //если пользователь не найден, выбрасываем ошибку, прекращаем выполнение
  if (!user) {
    showError("Пользователь с таким логином не зарегестрирован!");
    return;
  }
  //проверяем пароль, если неверный выбрасываем ошибку, иначу вызываем функцию авторизации
  if (user.password === authData.password) {
    authorization(authData);
    // переход на начальну страницу
    window.location.href = "../";
  } else {
    showError("Неверный пароль");
    clearPassword();
    return;
  }
}

//сброс ошибки при изменении одноги из полей
authForm.addEventListener("input", (event) => {
  if (event.target.tagName === "INPUT") {
    hideError();
  }
});
