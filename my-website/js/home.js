const API_KEY = 'a1e72fd93ed59f56e6332813b9f8dcae';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_URL = 'https://image.tmdb.org/t/p/w500';


const rowsContainer = document.getElementById('rows');
const hero = document.getElementById('hero');
const heroTitle = document.getElementById('heroTitle');
const heroDesc = document.getElementById('heroDesc');


const categories = [
{title:'Trending Now', endpoint:'trending/movie/week'},
{title:'Top Rated', endpoint:'movie/top_rated'},
{title:'Action', endpoint:'discover/movie&with_genres=28'},
{title:'Comedy', endpoint:'discover/movie&with_genres=35'},
{title:'Horror', endpoint:'discover/movie&with_genres=27'}
];


async function fetchTMDB(url){
const res = await fetch(`https://api.themoviedb.org/3/${url}&api_key=${TMDB_KEY}`);
return await res.json();
}


async function loadHero(){
const data = await fetchTMDB('movie/popular');
const movie = data.results[Math.floor(Math.random()*data.results.length)];
hero.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;
heroTitle.textContent = movie.title;
heroDesc.textContent = movie.overview.substring(0,150)+'...';
}


async function loadRows(){
for(let cat of categories){
const data = await fetchTMDB(cat.endpoint);
let rowHtml = `<div class="row"><h2>${cat.title}</h2><div class="movie-row">`;
for(let movie of data.results){
rowHtml += `<div class="movie" style="background-image:url(${IMG_URL+movie.poster_path})" onclick="alert('${movie.title}')"></div>`;
}
rowHtml += '</div></div>';
rowsContainer.innerHTML += rowHtml;
}
}


document.getElementById('searchInput').addEventListener('keypress', async function(e){
if(e.key==='Enter'){
const q = this.value;
const data = await fetchTMDB(`search/movie&query=${q}`);
rowsContainer.innerHTML='';
let rowHtml=`<div class="row"><h2>Search Results</h2><div class="movie-row">`;
for(let movie of data.results){
rowHtml+=`<div class="movie" style="background-image:url(${IMG_URL+movie.poster_path})" onclick="alert('${movie.title}')"></div>`;
}
rowHtml+='</div></div>';
rowsContainer.innerHTML=rowHtml;
}
});


loadHero();
loadRows();
