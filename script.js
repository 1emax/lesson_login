// ============================================
// DevTeen Camp — Урок JavaScript
// ============================================


// --- 1. МАСИВИ (Array) та ОБ'ЄКТИ (Object) ---

// ЩО ТАКЕ ОБ'ЄКТ?
// Об'єкт — це як паспорт або картка учня: набір полів із підписами.
// У масиві дані лежать просто по номерах: ["Іван", 15, "Київ"]
//   — незрозуміло, що є що: де ім'я, де вік, де місто?
// В об'єкті кожне значення має КЛЮЧ (назву):
//   { name: "Іван", age: 15, city: "Київ" }
//   — одразу видно: name — це ім'я, age — вік, city — місто.
//
// КОЛИ ВИКОРИСТОВУВАТИ?
// Масив — коли є список однакових речей: ["яблуко", "банан", "вишня"]
// Об'єкт — коли треба описати ОДНУ річ з різними властивостями.
//
// ЯК ЧИТАТИ / ЗАПИСУВАТИ?
//   siteInfo.name        → "DevTeen Camp"   (через крапку)
//   siteInfo["year"]     → 2026             (через квадратні дужки)
//   siteInfo.year = 2027                    (змінити значення)

// Простий об'єкт — інформація про сайт
const siteInfo = {
	name: "DevTeen Camp",
	year: 2026,
	language: "JavaScript"
};
console.log("Об'єкт siteInfo:", siteInfo);
console.log("Читаємо через крапку:", siteInfo.name);          // "DevTeen Camp"
console.log("Читаємо через дужки:", siteInfo["language"]);    // "JavaScript"

// Object.keys — повертає МАСИВ усіх ключів об'єкта
console.log("Object.keys:", Object.keys(siteInfo));   // ["name", "year", "language"]

// Object.values — повертає МАСИВ усіх значень об'єкта
console.log("Object.values:", Object.values(siteInfo)); // ["DevTeen Camp", 2026, "JavaScript"]

// Простий масив
const colors = ["red", "green", "blue"];
console.log("Масив colors:", colors);
console.log("Перший елемент:", colors[0]); // "red"

// Масив користувачів — кожен елемент це об'єкт (як картка учня).
// Тобто users — це "журнал" з "картками", наприклад:
// [ {name:"Іван", login:"ivan@gmail.com"}, {name:"Оля", login:"olya@gmail.com"} ]
let users = JSON.parse(localStorage.getItem("users") || "[]");


// --- 2. innerHeight — висота вікна браузера ---
document.getElementById("screenInfo").textContent =
	"Висота вікна: " + window.innerHeight + "px";
document.getElementById("app").style.minHeight = window.innerHeight + "px";


// --- 3. setInterval — годинник (оновлюється щосекунди) ---
document.getElementById("clock").textContent = new Date().toLocaleTimeString();

setInterval(function() {
	document.getElementById("clock").textContent = new Date().toLocaleTimeString();
}, 1000);


// --- 4. requestAnimationFrame — анімація кульки ---
const ball = document.getElementById("ball");
let ballX = 0;
let ballSpeed = 2;

function animateBall() {
	const maxX = ball.parentElement.offsetWidth - ball.offsetWidth;
	ballX += ballSpeed;

	if (ballX >= maxX || ballX <= 0) {
		ballSpeed = -ballSpeed; // змінюємо напрямок
	}

	ball.style.left = ballX + "px";
	requestAnimationFrame(animateBall); // викликаємо себе знову (рекурсія)
}
requestAnimationFrame(animateBall);


// --- 5. Показати / сховати пароль ---
function togglePass(inputId) {
	const input = document.getElementById(inputId);
	// if else — перевіряємо поточний тип
	if (input.type === "password") {
		input.type = "text";
	} else {
		input.type = "password";
	}
}


// --- 6. РЕЄСТРАЦІЯ (форма, валідація, масив, об'єкт, FileReader) ---
document.getElementById("regForm").addEventListener("submit", function(event) {
	event.preventDefault(); // зупиняємо перезавантаження сторінки

	const name     = document.getElementById("regName").value.trim();
	const login    = document.getElementById("regLogin").value.trim();
	const password = document.getElementById("regPass").value;
	const dob      = document.getElementById("regDob").value;
	const gender   = document.querySelector('input[name="gender"]:checked').value;

	// Валідація email через регулярний вираз
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)) {
		alert("❌ Введи правильний email, наприклад: hi-to-all@gmail.com");
		return;
	}
	if (password.length < 6) {
		alert("❌ Пароль мінімум 6 символів!");
		return;
	}

	// for i — перевіряємо чи логін вже зайнятий
	for (let i = 0; i < users.length; i++) {
		if (users[i].login === login) {
			alert("❌ Цей логін вже зайнятий!");
			return;
		}
	}

	// Створюємо об'єкт нового користувача.
	// Це як заповнити нову картку учня: записати ім'я, пошту, пароль тощо.
	// Потім ми покладемо цю "картку" в масив users (як у журнал класу).
	const newUser = {
		name: name,
		login: login,
		password: password,
		dob: dob,
		gender: gender === "man" ? "Хлопець" : "Дівчина",
		avatar: ""
	};
	console.log("Новий користувач (об'єкт):", newUser);

	// Зчитуємо фото з диску (FileReader)
	const fileInput = document.getElementById("regAvatar");

	if (fileInput.files[0]) {
		const reader = new FileReader();
		reader.onload = function(e) {
			newUser.avatar = e.target.result;
			saveAndLogin(newUser);
		};
		reader.readAsDataURL(fileInput.files[0]);
	} else {
		saveAndLogin(newUser);
	}
});

function saveAndLogin(user) {
	users.push(user); // додаємо в масив
	localStorage.setItem("users", JSON.stringify(users));
	localStorage.setItem("currentUser", JSON.stringify(user));
	renderUserList();
	showProfile(user);
	document.getElementById("regForm").reset();
}


// --- 7. ВХІД (пошук в масиві через for i) ---
document.getElementById("loginForm").addEventListener("submit", function(event) {
	event.preventDefault();

	const login    = document.getElementById("loginEmail").value.trim();
	const password = document.getElementById("loginPass").value;

	let found = null;

	for (let i = 0; i < users.length; i++) {
		if (users[i].login === login && users[i].password === password) {
			found = users[i];
			break; // знайшли — виходимо з циклу
		}
	}

	if (found) {
		localStorage.setItem("currentUser", JSON.stringify(found));
		showProfile(found);
	} else {
		alert("❌ Невірний логін або пароль!");
	}
});


// --- 8. ПОКАЗАТИ ПРОФІЛЬ (Object.keys + for i + createElement) ---
function showProfile(user) {
	document.getElementById("authSection").classList.add("hidden");
	document.getElementById("profileSection").classList.remove("hidden");

	document.getElementById("welcomeText").textContent = "Привіт, " + user.name + "! 👋";

	// Аватар
	const img = document.getElementById("profileImg");
	if (user.avatar) {
		img.src = user.avatar;
		img.classList.remove("hidden");
	} else {
		img.classList.add("hidden");
	}

	// Object.keys + for i — виводимо дані профілю у <li> список.
	// Навіщо Object.keys? Щоб не писати кожне поле вручну:
	//   user.name, user.login, user.dob, user.gender ...
	// Замість цього ми отримуємо масив ключів і проходимо по ньому циклом!
	// Це дуже зручно, коли у об'єкта багато полів.
	const labels = { name: "Ім'я", login: "Email", dob: "Народження", gender: "Стать" };
	const keys = Object.keys(labels); // ["name", "login", "dob", "gender"]
	const profileList = document.getElementById("profileDetails");
	profileList.innerHTML = "";

	for (let i = 0; i < keys.length; i++) {
		const li = document.createElement("li"); // створюємо <li>
		li.innerHTML = "<strong>" + labels[keys[i]] + ":</strong> " + (user[keys[i]] || "—");
		profileList.appendChild(li);             // додаємо <li> в <ul>
	}
}


// --- 9. ВИХІД ---
function logout() {
	localStorage.removeItem("currentUser");
	document.getElementById("authSection").classList.remove("hidden");
	document.getElementById("profileSection").classList.add("hidden");
}


// --- 10. СПИСОК КОРИСТУВАЧІВ (createElement + appendChild + for i) ---
function renderUserList() {
	const ul = document.getElementById("userList");
	ul.innerHTML = ""; // очищуємо список

	if (users.length === 0) {
		const li = document.createElement("li");
		li.textContent = "Поки нікого немає 🤷";
		ul.appendChild(li);
		return;
	}

	for (let i = 0; i < users.length; i++) {
		const li = document.createElement("li");
		li.textContent = (i + 1) + ". " + users[i].name + " — " + users[i].login;
		ul.appendChild(li);
	}
}


// --- ЗАПУСК ---
renderUserList();

// Перевіряємо чи вже є збережена сесія
const savedUser = localStorage.getItem("currentUser");
if (savedUser) {
	showProfile(JSON.parse(savedUser));
}
