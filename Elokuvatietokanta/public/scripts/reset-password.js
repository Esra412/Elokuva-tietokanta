    async function submitNewPassword() {
        const password = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        const statusMsg = document.getElementById('statusMsg');

        if (password !== confirm) {
            alert("Salasanat eivät täsmää!");
            return;
        }

        // Haetaan token suoraan URL-osoitteesta
        const token = window.location.pathname.split('/').pop();

        const res = await fetch(`/api/auth/reset-password/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const result = await res.json();

        if (res.ok) {
            alert("Salasana vaihdettu! Voit nyt kirjautua sisään.");
            window.location.href = '/login';
        } else {
            statusMsg.innerText = result.message;
            statusMsg.style.color = "red";
        }
    }