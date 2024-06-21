const apiKeyTmdb = "441e8e76a168da10c7a3bb9b4464a698"
const apiKey = "YOUR_API_KEY";
const searchUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=";

function getApiDataTmdb() {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKeyTmdb}&query=`;

    // This is a skeleton until we have api and other aspects of project completed



    function searchMovies(event) {
        if (event.key === 'Enter') {
            const query = document.getElementById('movieSearch').value;
            fetchMovies(query);
        }
    }

    console.log(movieApi);
};






// Dont know what this is and how it applys to what we have right now so i will leave this up to you Joshua
function fetchMovies(query) {
    fetch(searchUrl + encodeURIComponent(query))
        .then(response => response.json())
        .then(data => displayResults(data.results))
        .catch(error => console.error('Error fetching data:', error));
}
//  function that shows data for omdb in console and  will use with tmdb data 
function getMovieRatings(title, year) {
    const apiKey = '311fbec3';  // Your OMDb API key
    const omdbUrl = `http://www.omdbapi.com/?apikey=${apiKey}&t=${title}&y=${year}`;

    fetch(omdbUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                const ratings = data.Ratings;
                console.log(ratings);  // Handle the ratings data
            } else {
                console.error('Error:', data.Error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
getMovieRatings();

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


