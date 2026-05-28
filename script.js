/**
 * DevTeen Camp - JavaScript для кабінету користувача
 * Навчальний скрипт з детальними коментарями для майбутніх розробників (11-15 років)
 */

// 1. ГЛОБАЛЬНІ ЗМІННІ (СТАН ДОДАТКУ)
// Тут ми зберігаємо тимчасові дані під час роботи програми
let selectedAvatarData = ""; // Сюди запишемо картинку аватара в кодованому форматі (Base64)

// 2. ІНІЦІАЛІЗАЦІЯ ПРИ ЗАВАНТАЖЕННІ СТОРІНКИ
// Цей код виконається одразу, як тільки браузер прочитає файл
document.addEventListener("DOMContentLoaded", () => {
    // Встановимо дефолтний емодзі-аватар при першому запуску
    selectEmojiPreset("🤖");
    
    // Перевіряємо, чи є вже залогінений користувач у браузері
    checkSession();
    
    // Додаємо слухачі подій на наші форми (відстежуємо натискання кнопок відправки)
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.getElementById("registerForm").addEventListener("submit", handleRegister);

    // Додаємо слухач на зміну файлу аватара
    document.getElementById("regAvatarFile").addEventListener("change", handleFileSelect);
});

// 3. ФУНКЦІЯ ПЕРЕВІРКИ СЕСІЇ (ЧИ ВЖЕ УВІЙШОВ КОРИСТУВАЧ)
function checkSession() {
    // localstorage - це вбудована база даних у браузері. Вона зберігає дані навіть після закриття вкладки!
    const currentUserJson = localStorage.getItem("currentUser");

    if (currentUserJson) {
        // Якщо знайшли користувача, перетворюємо текст (JSON) назад у JavaScript-Об'єкт
        const user = JSON.parse(currentUserJson);
        showProfile(user);
    } else {
        // Якщо нікого немає, показуємо форми авторизації
        showAuthForms();
    }
}

// 4. ПЕРЕМИКАННЯ ТАБІВ (Вхід / Реєстрація)
// querySelector допомагає нам знаходити будь-які теги на сторінці так само, як у CSS
function switchTab(tab) {
    const loginSec = document.getElementById("loginSection");
    const registerSec = document.getElementById("registerSection");
    const tabLogin = document.getElementById("tabLogin");
    const tabRegister = document.getElementById("tabRegister");
    
    // Скидаємо повідомлення про статус при зміні вкладки
    hideStatus();

    if (tab === 'login') {
        loginSec.classList.remove("hidden");
        registerSec.classList.add("hidden");
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
    } else {
        loginSec.classList.add("hidden");
        registerSec.classList.remove("hidden");
        tabLogin.classList.remove("active");
        tabRegister.classList.add("active");
    }
}

// 5. ПОКАЗАТИ / ПРИХОВАТИ ПАРОЛЬ
// Проста функція, яка змінює тип input з password на text і навпаки
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    const svg = btn.querySelector("svg");
    
    if (input.type === "password") {
        input.type = "text";
        btn.style.color = "var(--color-accent)"; // Робимо іконку кольоровою, коли пароль видно
    } else {
        input.type = "password";
        btn.style.color = "var(--text-secondary)";
    }
}

// 6. РОБОТА З ФОТО (FileReader API)
// Функція спрацьовує, коли учень вибирає файл зі свого комп'ютера
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (file) {
        // Перевіряємо розмір файлу (краще обмежити до 1.5MB, бо localStorage має ліміт ~5MB)
        if (file.size > 1500 * 1024) {
            showStatus("❌ Файл занадто великий! Виберіть фото менше 1.5 МБ.", "error");
            return;
        }

        const reader = new FileReader();
        
        // onload виконається тоді, коли браузер повністю зчитає файл з диска
        reader.onload = (e) => {
            const base64String = e.target.result;
            selectedAvatarData = base64String;
            
            // Оновлюємо прев'ю на формі реєстрації
            document.getElementById("regAvatarPreview").src = base64String;
        };
        
        // Зчитуємо картинку як DataURL (це перетворює її на довгий текстовий рядок)
        reader.readAsDataURL(file);
    }
}

// Функція для швидкого вибору готового емодзі-аватара
function selectEmojiPreset(emoji) {
    // Створюємо красиву картинку SVG "на льоту" з вибраним емодзі всередині
    const svgString = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%236366f1'/><text x='50%' y='58%' font-size='45' text-anchor='middle' dominant-baseline='middle'>${emoji}</text></svg>`;
    
    // Перетворюємо SVG на Base64 рядок
    const base64String = "data:image/svg+xml;utf8," + encodeURIComponent(svgString);
    selectedAvatarData = base64String;
    
    // Візуально показуємо, який аватар обрано
    document.getElementById("regAvatarPreview").src = base64String;
}

// 7. ВАЛІДАЦІЯ ТА РЕЄСТРАЦІЯ
function handleRegister(event) {
    // event.preventDefault() зупиняє перезавантаження сторінки при відправці форми!
    // Це дозволяє нашому JavaScript обробити дані самостійно.
    event.preventDefault();
    hideStatus();

    // Збираємо значення з полів форми реєстрації
    const name = document.getElementById("regName").value.trim();
    const login = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const dob = document.getElementById("regDob").value;
    
    // Отримуємо значення радіо-кнопки (gender)
    const gender = document.querySelector('input[name="gender"]:checked').value;

    // ВАЛІДАЦІЯ за допомогою Регулярних Виразів (Regex)
    // Перевіряємо, чи email має правильну структуру (наприклад, hi-to-all@gmail.com)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(login)) {
        showStatus("❌ Будь ласка, вкажи правильну електронну пошту (наприклад: hi-to-all@gmail.com)", "error");
        return;
    }

    if (password.length < 6) {
        showStatus("❌ Пароль має містити щонайменше 6 символів для безпеки!", "error");
        return;
    }

    // Завантажуємо масив користувачів, або створюємо новий порожній масив, якщо це перший юзер
    // Array + Objects у дії!
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Перевіряємо, чи немає вже користувача з таким логіном
    const userExists = users.some(u => u.login.toLowerCase() === login.toLowerCase());
    if (userExists) {
        showStatus("❌ Цей логін вже зайнятий іншим розробником. Спробуй інший!", "error");
        return;
    }

    // Створюємо ОБ'ЄКТ нового користувача
    const newUser = {
        name: name,
        login: login,
        password: password, // Зберігаємо пароль (у навчальних цілях - відкритим)
        dob: dob,
        gender: gender,
        avatar: selectedAvatarData
    };

    // Додаємо об'єкт у наш МАСИВ (Array.push)
    users.push(newUser);

    // Зберігаємо масив назад у localStorage, перетворивши його на рядок (JSON.stringify)
    localStorage.setItem("users", JSON.stringify(users));

    // Автоматично логінимо нового користувача для крутого юзер-експірієнсу!
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    
    showStatus("🎉 Реєстрація успішна! Ласкаво просимо в клуб!", "success");
    
    // Через 1.5 секунди оновлюємо екран та показуємо профіль
    setTimeout(() => {
        showProfile(newUser);
        // Очищуємо поля форми реєстрації
        document.getElementById("registerForm").reset();
        selectEmojiPreset("🤖"); // скидаємо прев'ю на дефолт
    }, 1200);
}

// 8. АВТОРИЗАЦІЯ (ВХІД)
function handleLogin(event) {
    event.preventDefault();
    hideStatus();

    const loginInput = document.getElementById("loginEmail").value.trim();
    const passwordInput = document.getElementById("loginPassword").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    // Завантажуємо масив користувачів
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Шукаємо користувача з відповідним логіном та паролем (if else)
    const foundUser = users.find(u => 
        u.login.toLowerCase() === loginInput.toLowerCase() && 
        u.password === passwordInput
    );

    if (foundUser) {
        // Зберігаємо поточну сесію
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        
        // Якщо учень поставив галочку "Запам'ятати мене", можемо зробити додатковий запис (для уроку)
        if (rememberMe) {
            localStorage.setItem("rememberedLogin", loginInput);
        } else {
            localStorage.removeItem("rememberedLogin");
        }

        showStatus("🔓 Вхід виконано! Завантажуємо профіль...", "success");

        setTimeout(() => {
            showProfile(foundUser);
            document.getElementById("loginForm").reset();
        }, 1000);
    } else {
        showStatus("❌ Невірний логін або пароль! Спробуй ще раз.", "error");
    }
}

// 9. ОНОВЛЕННЯ ЕКРАНУ: ПОКАЗАТИ ПРОФІЛЬ КОРИСТУВАЧА
function showProfile(user) {
    // Ховаємо форми та перемикач табів
    document.getElementById("authTabs").classList.add("hidden");
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("registerSection").classList.add("hidden");
    
    // Показуємо кабінет
    document.getElementById("profileSection").classList.remove("hidden");
    
    // Заповнюємо дані профілю
    document.getElementById("profileWelcomeName").textContent = `Привіт, ${user.name}! 👋`;
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileLogin").textContent = user.login;
    
    // Перетворюємо стать на красивий український текст з емодзі
    const genderText = user.gender === "man" ? "Хлопець 👦" : "Дівчина 👧";
    document.getElementById("profileGender").textContent = genderText;

    // Форматуємо дату народження (наприклад, з 2012-05-15 робимо 15.05.2012)
    if (user.dob) {
        const parts = user.dob.split("-"); // Розбиваємо рядок по дефісу
        if (parts.length === 3) {
            document.getElementById("profileDob").textContent = `${parts[2]}.${parts[1]}.${parts[0]}`;
        } else {
            document.getElementById("profileDob").textContent = user.dob;
        }
    } else {
        document.getElementById("profileDob").textContent = "Не вказано";
    }

    // Ставимо аватар користувача
    if (user.avatar) {
        document.getElementById("profileImage").src = user.avatar;
    } else {
        // Якщо немає аватара, поставимо стандартний
        document.getElementById("profileImage").src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%236366f1'/><text x='50%' y='55%' font-size='40' text-anchor='middle' dominant-baseline='middle'>💻</text></svg>";
    }
}

// 10. ОНОВЛЕННЯ ЕКРАНУ: ПОКАЗАТИ ВХІД / РЕЄСТРАЦІЮ
function showAuthForms() {
    document.getElementById("authTabs").classList.remove("hidden");
    document.getElementById("profileSection").classList.add("hidden");
    
    // За замовчуванням відкриваємо таб логіну
    switchTab('login');

    // Автозаповнення збереженого логіну, якщо ставили галочку "Запам'ятати мене"
    const rememberedLogin = localStorage.getItem("rememberedLogin");
    if (rememberedLogin) {
        document.getElementById("loginEmail").value = rememberedLogin;
        document.getElementById("rememberMe").checked = true;
    }
}

// 11. ВИХІД З АКАУНТУ (ЛОГАУТ)
function logout() {
    // Видаляємо поточного юзера з сесії
    localStorage.removeItem("currentUser");
    
    showAuthForms();
    showStatus("🚪 Ви виходоли з акаунту. До зустрічі!", "success");
    
    // Сховати статус через 3 секунди
    setTimeout(hideStatus, 3000);
}

// 12. ДОПОМІЖНІ ФУНКЦІЇ ДЛЯ СТАТУСНИХ ПОВІДОМЛЕНЬ
function showStatus(text, type) {
    const statusMsg = document.getElementById("statusMessage");
    statusMsg.textContent = text;
    statusMsg.className = `status-msg ${type}`; // додаємо клас error або success
}

function hideStatus() {
    const statusMsg = document.getElementById("statusMessage");
    statusMsg.className = "status-msg hidden";
}
