    // Simuloidaan kirjautumistilaa
    const isLoggedIn = false;

    const protectedLinks = document.querySelectorAll('.requires-login');

    protectedLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!isLoggedIn) {
                e.preventDefault();
                document.getElementById('loginModal').style.display = 'flex';
            }
        });
    });

    function closeModal() {
        document.getElementById('loginModal').style.display = 'none';
    }
