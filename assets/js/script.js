

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('searchButton').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission
        searchMovies();
    });
});

function searchMovies() {
    const apiKey = '441e8e76a168da10c7a3bb9b4464a698';
    const query = document.getElementById('movieSearch').value;
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodedQuery}`;

    fetch(searchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.results.length > 0) {
                displayResults(data.results);
            } else {
                console.error('No movies found');
                displayErrorMessage('No movies found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage('Failed to fetch movies');
        });
}

function displayResults(movies) {
    const resultsSection = document.getElementById('results');

    // Only clear results if there are no movies found
    if (movies.length === 0) {
        clearResults();
        return;
    }

    // Maximum number of movies to display
    const maxMovies = Math.min(movies.length, 6);

    for (let i = 0; i < maxMovies; i++) {
        const movie = movies[i];
        const movieBox = document.createElement('div');
        movieBox.classList.add('movie-box');

        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        const movieOverview = document.createElement('p');
        movieOverview.textContent = movie.overview;

        movieBox.appendChild(movieTitle);
        movieBox.appendChild(movieOverview);

        // Fetch and display main poster image for the movie
        if (movie.poster_path) {
            fetchPosterImage(movie.poster_path, movieBox);
        } else {
            console.error('No poster path available for:', movie.title);
        }

        // Fetch and display ratings for the movie
        getMovieRatings(movie.title, movie.release_date ? movie.release_date.split('-')[0] : null, movieBox);

        resultsSection.appendChild(movieBox);
    }
}

function fetchPosterImage(posterPath, movieBox) {
    const imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'Movie Poster';
    imgElement.classList.add('poster');

    // Append the poster image to the movie box
    movieBox.appendChild(imgElement);
}

function getMovieRatings(title, year, movieBox) {
    // if (!year) {
    //     console.error('Release year not available for:', title);
    //     return;
    // }
    //  OMDb API key
    const apiKey = '311fbec3';

    const omdbUrl = `http://www.omdbapi.com/?apikey=${apiKey}&t=${title}&y=${year}`;

    fetch(omdbUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.Response === "True") {
                // Display ratings only
                const ratings = data.Ratings;
                const ratingsDiv = document.createElement('div');
                ratingsDiv.classList.add('ratings');

                ratings.forEach(rating => {
                    const ratingElement = document.createElement('p');
                    ratingElement.textContent = `${rating.Source}: ${rating.Value}`;
                    ratingsDiv.appendChild(ratingElement);
                });

                movieBox.appendChild(ratingsDiv);
            } else {
                console.error('Error:', data.Error);
                displayErrorMessage('Failed to fetch ratings');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage('Failed to fetch ratings');
        });
}

function clearResults() {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = ''; // Clear previous results
}

function displayErrorMessage(message) {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = `<p>${message}</p>`;
}