// регистрация

//необходимые html элементы
const regForm = document.getElementById("reg-form");
const usernameInput = document.getElementById("login");
const passwordInput = document.getElementById("password");
const repeatPasswordInput = document.getElementById("repeatPassword");

const errorField = document.querySelector(".warning");
let usersBase = [];

getUsersData();

//получаем данные о всех пользователях из localStorage

function getUsersData() {
  let data = localStorage.getItem("users");
  if (!data) {
    return;
  }
  usersBase = JSON.parse(data);
}

//снимаем ошибку при изменении одного из полей
regForm.addEventListener("input", (event) => {
  if (event.target.tagName === "INPUT") {
    hideError();
  }
});
//выводим ошибку с нужным текстом
function showError(text) {
  errorField.textContent = text;
}
//прячем ошибку
function hideError() {
  errorField.innerHTML = "&nbsp;";
}

//очищаем поле пароля
function clearPassword() {
  passwordInput.value = "";
  repeatPasswordInput.value = "";
}

//обрабатываем submit на форме, полчаем данные из полей
regForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const regData = {
    username: usernameInput.value,
    password: passwordInput.value,
    repeatPassword: repeatPasswordInput.value,
  };
  checkData(regData);
});

//функция регистрации,добавление нового пользователя в массив usersBase и отправка данных в localStorage
function registration(regData) {
  delete regData.repeatPassword;
  usersBase.push(regData);
  localStorage.setItem("users", JSON.stringify(usersBase));
  localStorage.setItem("currentUser", JSON.stringify(regData.username));
}

//функция проверки введенных данных с выводом соответсвтующих ошибок
function checkData(regData) {
  let isError = false;
  for (const key in regData) {
    if (!regData[key]) {
      showError("Заполнены не все поля!");
      return;
    }
  }
  if (regData.password !== regData.repeatPassword) {
    showError("Пароли не совпадают!");
    clearPassword();
    return;
  }

  if (regData.password.length < 9) {
    showError("Пароль должен быть длиннее 8 символов!");
    clearPassword();
    return;
  }

  if (
    usersBase.some((user) => {
      return user.username === regData.username;
    })
  ) {
    showError("Пользователь с таким именем уже зарегистрирован!");
    return;
  }
  registration(regData);
  //переход на начальную страницу
  window.location.href = "../";
}
