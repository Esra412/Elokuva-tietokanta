const popup = document.getElementById("popup");
const addBtn = document.getElementById("addReviewBtn");
const saveBtn = document.getElementById("saveReview");
const movieInput = document.getElementById("movieName");
const stars = document.querySelectorAll(".stars span");
const reviewList = document.getElementById("reviewList");

let selectedStars = 0;

  // Verileri tarayıcı hafızasından al
    let movies = JSON.parse(localStorage.getItem('myMovies')) || [];

    function addMovie() {
        const name = prompt("Elokuvan nimi:");
        if (!name) return;

        const stars = parseInt(prompt("Montako tähtiä? (Max 6):"));
        
        if (isNaN(stars) || stars < 1 || stars > 6) {
            alert("Ole hyvä ve anna luku 1 ja 6 välillä!");
            return;
        }

        const newMovie = {
            id: Date.now(),
            name: name,
            rating: stars
        };

        movies.push(newMovie);
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('myMovies', JSON.stringify(movies));
        renderMovies();
    }

    function renderMovies() {
        const grid = document.getElementById('movieGrid');
        grid.innerHTML = '';

        movies.forEach(movie => {
            const starHtml = '★'.repeat(movie.rating) + '☆'.repeat(6 - movie.rating);
            
            const card = document.createElement('div');
            card.className = 'clapper-card';
            card.onclick = () => openDetails(movie);
            
            card.innerHTML = `
                <div class="clapper-top"></div>
                <div class="clapper-body">
                    <div class="movie-title">${movie.name}</div>
                    <div class="stars">${starHtml}</div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function openDetails(movie) {
        // Yeni sekmede basit bir detay sayfası açar
        // Open the dedicated review page as a new tab, passing movie name and rating
        const url = `/arvostelu?movie=${encodeURIComponent(movie.name)}&rating=${encodeURIComponent(movie.rating)}`;
        window.open(url, '_blank');
    }

    // İlk açılışta kartları yükle
    renderMovies();
