// This is a skeleton until we have api and other aspects of project completed

const apiKey = "YOUR_API_KEY";
const searchUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=";

function searchMovies(event) {
    if (event.key === 'Enter') {
        const query = document.getElementById('movieSearch').value;
        fetchMovies(query);
    }
}

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
