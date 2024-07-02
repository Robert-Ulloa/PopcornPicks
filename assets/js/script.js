// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', function () {
    // Get the search button element and add a click event listener
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default form submission
            searchMovies(); // Call the function to search for movies
        });
    }

    // Display the user's watchlist and top five movies
    displayWatchlist();
    displayTopFive();
});

// Function to search for movies using TMDB API
function searchMovies() {
    const apiKey = '441e8e76a168da10c7a3bb9b4464a698';
    const query = document.getElementById('movieSearch').value;
    const encodedQuery = encodeURIComponent(query); // Encode the query for safe URL usage
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodedQuery}`;

    clearResults(); // Clear any previous search results

    // Fetch movies from the API
    fetch(searchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display search results if movies are found
            if (data.results.length > 0) {
                displayResults(data.results);
            } else {
                console.error('No movies found');
                displayErrorMessage('No movies found'); // Display error message if no movies are found
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage('Failed to fetch movies'); // Display error message for failed API request
        });
}

// Function to display search results
function displayResults(movies) {
    const resultsSection = document.getElementById('results'); // Get results section
    const modal = document.querySelector('#modal'); // Get modal for displaying details

    clearResults(); // Clear previous results if any

    const maxMovies = Math.min(movies.length, 10); // Limit to 10 movies
    for (let i = 0; i < maxMovies; i++) {
        const movie = movies[i];
        const movieBox = document.createElement('div'); // Create a div for each movie
        movieBox.classList.add('movie-box'); // Add CSS class for styling

        // Create elements for movie title, overview, and add to watchlist button
        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        const movieOverview = document.createElement('p');
        movieOverview.textContent = movie.overview;

        const addToWatchlistButton = document.createElement('button');
        addToWatchlistButton.textContent = 'Add to Watchlist';
        addToWatchlistButton.addEventListener('click', function () {
            addToWatchlist(movie); // Add movie to watchlist when button is clicked
            showModal(); // Show modal to confirm action
        });

        // Append elements to movie box
        movieBox.appendChild(movieTitle);
        movieBox.appendChild(movieOverview);
        movieBox.appendChild(addToWatchlistButton);

        // Fetch poster image for the movie or display default image
        if (movie.poster_path) {
            fetchPosterImage(movie.poster_path, movieBox);
        } else {
            displayDefaultImage(movieBox);
        }

        // Fetch movie ratings and append them to the movie box
        getMovieRatings(movie.title, movie.release_date ? movie.release_date.split('-')[0] : null, movieBox);

        // Append movie box to results section
        resultsSection.appendChild(movieBox);

        // Add event listeners for modal close actions
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                hideModal(); // Hide modal if clicked outside of its content
            }
        });
    }
}

// Function to show modal for successful actions
function showModal() {
    const modal = document.querySelector('#modal');
    modal.classList.add('is-active'); // Add CSS class to show modal

    // Automatically hide modal after 1 second
    setTimeout(() => {
        hideModal();
    }, 1000);
}

// Function to hide modal
function hideModal() {
    const modal = document.querySelector('#modal');
    modal.classList.remove('is-active'); // Remove CSS class to hide modal
}

// Function to fetch and display poster image for a movie
function fetchPosterImage(posterPath, movieBox) {
    const imageUrl = `https://image.tmdb.org/t/p/w200${posterPath}`;
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'Movie Poster';
    imgElement.classList.add('poster'); // Add CSS class for styling
    movieBox.appendChild(imgElement); // Append image element to movie box
}

// Function to display default poster image if no poster is available
function displayDefaultImage(movieBox) {
    const defaultImageUrl = './assets/img/default-poster-image.jpg';
    const imgElement = document.createElement('img');
    imgElement.src = defaultImageUrl;
    imgElement.alt = 'Default Movie Poster';
    imgElement.classList.add('poster'); // Add CSS class for styling
    movieBox.appendChild(imgElement); // Append image element to movie box
}

// Function to get movie ratings from OMDB API
function getMovieRatings(title, year, movieBox) {
    const apiKey = '311fbec3';
    const omdbUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${title}&y=${year}`;

    fetch(omdbUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.Response === "True") {
                const ratings = data.Ratings;
                const ratingsDiv = document.createElement('div');
                ratingsDiv.classList.add('ratings'); // Add CSS class for styling

                // Display each rating source and value
                ratings.forEach(rating => {
                    const ratingElement = document.createElement('p');
                    ratingElement.textContent = `${rating.Source}: ${rating.Value}`;
                    ratingsDiv.appendChild(ratingElement); // Append rating element to ratings div
                });

                movieBox.appendChild(ratingsDiv); // Append ratings div to movie box
            } else {
                console.error('Error:', data.Error);
                const ratingErrorElement = document.createElement('p');
                ratingErrorElement.textContent = 'Ratings not available';
                movieBox.appendChild(ratingErrorElement); // Display error message if ratings are not available
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const ratingErrorElement = document.createElement('p');
            ratingErrorElement.textContent = 'Failed to fetch ratings';
            movieBox.appendChild(ratingErrorElement); // Display error message for failed API request
        });
}

// Function to add a movie to the watchlist
function addToWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist.push(movie);
    localStorage.setItem('watchlist', JSON.stringify(watchlist)); // Store updated watchlist in local storage
}

// Function to clear search results
function clearResults() {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = ''; // Clear HTML content inside results section
}

// Function to display error message in results section
function displayErrorMessage(message) {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = `<p>${message}</p>`; // Display error message as HTML
}

// Function to display movies in the watchlist
function displayWatchlist() {
    const genreSections = document.getElementById('genre-sections');
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    console.log('Loaded watchlist:', watchlist); // Debugging line

    genreSections.innerHTML = ''; // Clear existing content in genre sections

    // Display message if watchlist is empty
    if (watchlist.length === 0) {
        genreSections.innerHTML = '<p>No movies in your watchlist.</p>';
        return;
    }

    // Loop through each movie in the watchlist and display it
    watchlist.forEach(movie => {
        const movieBox = document.createElement('div');
        movieBox.classList.add('movie-box'); // Add CSS class for styling

        // Create elements for movie title and overview
        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        const movieOverview = document.createElement('p');
        movieOverview.textContent = movie.overview;

        // Append title and overview to movie box
        movieBox.appendChild(movieTitle);
        movieBox.appendChild(movieOverview);

        // Fetch and display poster image if available
        if (movie.poster_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Movie Poster';
            imgElement.classList.add('poster'); // Add CSS class for styling
            movieBox.appendChild(imgElement); // Append image element to movie box
        }

        // Create button to add movie to top five list
        const addToTopFiveButton = document.createElement('button');
        addToTopFiveButton.classList.add('button', 'add-to-top-five');
        addToTopFiveButton.textContent = 'Add to Top 5';
        addToTopFiveButton.addEventListener('click', () => {
            movieBox.remove(); // Remove movie from watchlist display
            addToTopFive(movie); // Add movie to top five list
        });

        movieBox.appendChild(addToTopFiveButton); // Append button to movie box
        genreSections.appendChild(movieBox); // Append movie box to genre sections
    });
}

// Function to display top five movies
function displayTopFive() {
    const topFiveSection = document.getElementById('top-5-section');
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];

    console.log('Loaded topFive:', topFive); // Debugging line

    topFiveSection.innerHTML = '<h2 class="subtitle">Top 5</h2>'; // Set title for top five section

    // Display message if top five list is empty
    if (topFive.length === 0) {
        return;
    }

    // Loop through each movie in the top five list and display it
    topFive.forEach(movie => {
        const movieBox = document.createElement('div');
        movieBox.classList.add('movie-box'); // Add CSS class for styling

        // Create elements for movie title and overview
        const movieTitle = document.createElement('h2');
        movieTitle.textContent = movie.title;

        const movieOverview = document.createElement('p');
        movieOverview.textContent = movie.overview;

        // Append title and overview to movie box
        movieBox.appendChild(movieTitle);
        movieBox.appendChild(movieOverview);

        // Fetch and display poster image if available
        if (movie.poster_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = 'Movie Poster';
            imgElement.classList.add('poster'); // Add CSS class for styling
            movieBox.appendChild(imgElement); // Append image element to movie box
        }

        // Create button to remove movie from top five list
        const removeFromTopFiveButton = document.createElement('button');
        removeFromTopFiveButton.classList.add('button', 'remove-from-top-five');
        removeFromTopFiveButton.textContent = 'Remove from Top 5';
        removeFromTopFiveButton.addEventListener('click', () => removeFromTopFive(movie)); // Add event listener to remove movie from top five
        movieBox.appendChild(removeFromTopFiveButton); // Append button to movie box

        topFiveSection.appendChild(movieBox); // Append movie box to top five section
    });
}

// Function to add a movie to the top five list
function addToTopFive(movie) {
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];
    if (topFive.length < 5) {
        topFive.push(movie); // Add movie to top five list if less than 5 movies
        localStorage.setItem('topFive', JSON.stringify(topFive)); // Store updated top five list in local storage
        displayTopFive(); // Update displayed top five list
    }
}

// Function to remove a movie from the top five list
function removeFromTopFive(movie) {
    let topFive = JSON.parse(localStorage.getItem('topFive')) || [];
    topFive = topFive.filter(m => m.title !== movie.title); // Filter out movie to be removed
    localStorage.setItem('topFive', JSON.stringify(topFive)); // Store updated top five list in local storage
    displayTopFive(); // Update displayed top five list
}
