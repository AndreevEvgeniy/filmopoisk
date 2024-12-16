//места в html, где содержится имя пользователя
const userNameFields = document.querySelectorAll(".username");

//получаем данные о всех пользователях из localStorage
function getUserData() {
  let currentUserJSON = localStorage.getItem("currentUser");
  if (currentUserJSON) {
    currentUser = JSON.parse(currentUserJSON);
  }
}

//передаем имя пользователя в html страницу
function showUserInfo() {
  userNameFields.forEach((filed) => {
    filed.textContent = currentUser;
  });
}
getUserData();
showUserInfo();

//элемент кнопки выхода из аккаунта
const exitBtn = document.querySelector(".exit-btn");

//обработка клика по кнопке
exitBtn.addEventListener("click", () => {
  //устнаваливаем текущего пользователя, как '' в localStorage
  localStorage.setItem("currentUser", "");
  //переходим на главную страницу
  window.location.href = "../";
});
