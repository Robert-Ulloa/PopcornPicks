 const apiKeyTmdb = "441e8e76a168da10c7a3bb9b4464a698"


 function getApiDataTmdb () {
 const tmdbUrl = `https://api.themoviedb.org/3/movie/157336/images?api_key=${apiKeyTmdb}`;
// This is a skeleton until we have api and other aspects of project completed

const apiKey = "YOUR_API_KEY";
const searchUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=";

function searchMovies(event) {
    if (event.key === 'Enter') {
        const query = document.getElementById('movieSearch').value;
        fetchMovies(query);
    }
}

console.log(movieApi);
 };


 const apiKeyOmdb = "311fbec3"
 
 function geApiDataOmdb () {
    const omdbUrl = `http://www.omdbapi.com/?apikey=${311fbec3}&t=${title}&y=${year}`;
 };
function fetchMovies(query) {
    fetch(searchUrl + encodeURIComponent(query))
        .then(response => response.json())
        .then(data => displayResults(data.results))
        .catch(error => console.error('Error fetching data:', error));
}

function displayResults(movies) {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = ''; // Clear previous results

    if (movies.length === 0) {
        resultsSection.innerHTML = '<p>No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieBox = document.createElement('div');
        movieBox.classList.add('movie-box');

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        const movieOverview = document.createElement('p');
        movieOverview.textContent = movie.overview;

        movieBox.appendChild(movieTitle);
        movieBox.appendChild(movieOverview);
        resultsSection.appendChild(movieBox);
    });
}
