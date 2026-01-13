/* ---------- ELEMENTTIEN HAKU ---------- */
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const codeStatus = document.getElementById("codeStatus");

/* ---------- TÄB-VAIHTO ---------- */
function showLogin() {
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    document.querySelectorAll(".tab")[0].classList.add("active");
    document.querySelectorAll(".tab")[1].classList.remove("active");
}

function showRegister() {
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
    document.querySelectorAll(".tab")[1].classList.add("active");
    document.querySelectorAll(".tab")[0].classList.remove("active");
}

async function register() {
    const data = {
        username: registerUsername.value,
        email: registerEmail.value,
        password: registerPassword.value
    };

    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    codeStatus.innerText = result.message;
}

async function login() {
    const data = {
        email: loginEmail.value,
        password: loginPassword.value
    };

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
        window.location.href = '/dashboard';
    } else {
        alert(result.message);
    }
}
