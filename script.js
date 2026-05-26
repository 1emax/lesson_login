const isLogined = true;

if (isLogined) {
	document.querySelector("#registration").className = "hidden"
}

document.querySelector("#loginForm p").textContent = new Date().toString();

// document.querySelector("#loginForm input.apply-form").onclick = function(event) {
// 	event.preventDefault()
// 	document.querySelector("#loginForm p").textContent = "Ви заповнили форму"
// }
function handleLoginForm(event) {
	event.preventDefault()
	document.querySelector("#loginForm p").textContent = "Ви заповнили форму"

	// зберігаємо у змінні доступ то потрібних нам тегів
	const loginTag = document.getElementById("login");
	const passwordTag = document.querySelector("#password")

	// витягуємо значення тегів
	const login = loginTag.value;
	const password = passwordTag.value;

	console.log(login, password, loginTag, passwordTag)
	// localStorage.setItem(`login`, login)
}

document.querySelector("#loginForm form").addEventListener('submit', handleLoginForm)