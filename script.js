let isLogined = false;

const currentLogin = localStorage.getItem("login")

if (currentLogin) {
	const isAuthorized = localStorage.getItem("authorized")

	isLogined = true

	const profileImage = document.getElementById('display-image')
	profileImage.src = localStorage.getItem('recent-image')
	profileImage.className = ""
	
}

if (isLogined) {
	document.querySelector("#registration").className = "hidden"
}

document.querySelector("#loginForm p").textContent = new Date().toString();

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
	localStorage.setItem("authorized", "tak")
}

function yeyReact(event) {
	const passTag = document.querySelector("#password")
	if (passTag.type == "password") {
		password.type = "text"
	} else {
		password.type = "password"
	}
}

function storeImage(fileElement) {
	const file = fileElement.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const base64String = event.target.result;
        
        // Store it (Note: localStorage has a ~5MB limit)
        localStorage.setItem('recent-image', base64String);
    };

    reader.readAsDataURL(file);
}

function register(event) {
	event.preventDefault()

	localStorage.setItem("login", document.querySelector("#registration input[name=login]").value)
	localStorage.setItem("password", document.querySelector("#registration input[name=password]").value)
	localStorage.setItem("name", document.querySelector("#registration input[name=name]").value)

	storeImage(document.querySelector("#registration input[name=avatar]"));
}

document.querySelector("#loginForm form").addEventListener('submit', handleLoginForm)
document.querySelector("#registration form").addEventListener('submit', register)

document.querySelector(".eye-parent").addEventListener("click", yeyReact)

