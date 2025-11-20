const API_KEY = 'a1e72fd93ed59f56e6332813b9f8dcae';
   const IMG_URL = 'https://image.tmdb.org/t/p/w500';
    const BG_URL = 'https://image.tmdb.org/t/p/original';

document.addEventListener("DOMContentLoaded", () => {

    const rowsContainer = document.getElementById('rows');
    const hero = document.getElementById('hero');
    const heroTitle = document.getElementById('heroTitle');
    const heroDesc = document.getElementById('heroDesc');
    const searchInput = document.getElementById('searchInput');

    const categories = [
        { title: 'Trending Now', endpoint: 'trending/movie/week' },
        { title: 'Top Rated', endpoint: 'movie/top_rated' },
        { title: 'Action', endpoint: 'discover/movie?with_genres=28' },
        { title: 'Comedy', endpoint: 'discover/movie?with_genres=35' },
        { title: 'Horror', endpoint: 'discover/movie?with_genres=27' }
    ];

    async function fetchTMDB(url) {
        const res = await fetch(`https://api.themoviedb.org/3/${url}&api_key=${TMDB_KEY}`);
        if(!res.ok) throw new Error('Failed to fetch TMDB API');
        return res.json();
    }

    async function loadHero() {
        try {
            const data = await fetchTMDB('movie/popular?language=en-US&page=1');
            const movie = data.results[Math.floor(Math.random() * data.results.length)];
            hero.style.backgroundImage = `url('${BG_URL + movie.backdrop_path}')`;
            heroTitle.textContent = movie.title;
            heroDesc.textContent = movie.overview.substring(0, 180) + '...';
        } catch (err) {
            console.error('Hero load error:', err);
        }
    }

    async function loadRows() {
        rowsContainer.innerHTML = '';
        for (let cat of categories) {
            try {
                const data = await fetchTMDB(cat.endpoint + '&language=en-US&page=1');
                const rowHtml = `
                    <div class="row">
                        <h2>${cat.title}</h2>
                        <div class="movie-row">
                            ${data.results.map(m => `
                                <div class="movie" 
                                     style="background-image:url(${IMG_URL + m.poster_path})" 
                                     title="${m.title}"
                                     onclick="alert('${m.title}')">
                                </div>`).join('')}
                        </div>
                    </div>`;
                rowsContainer.innerHTML += rowHtml;
            } catch (err) {
                console.error(`Error loading category ${cat.title}:`, err);
            }
        }
    }

    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const q = searchInput.value.trim();
            if (!q) return;
            try {
                const data = await fetchTMDB(`search/movie?query=${encodeURIComponent(q)}&language=en-US&page=1`);
                rowsContainer.innerHTML = `
                    <div class="row">
                        <h2>Search Results</h2>
                        <div class="movie-row">
                            ${data.results.map(m => `
                                <div class="movie" 
                                     style="background-image:url(${IMG_URL + m.poster_path})" 
                                     title="${m.title}"
                                     onclick="alert('${m.title}')">
                                </div>`).join('')}
                        </div>
                    </div>`;
            } catch (err) {
                console.error('Search error:', err);
            }
        }
    });

    loadHero();
    loadRows();
});
