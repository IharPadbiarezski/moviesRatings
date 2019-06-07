// Variables

const addForm = document.querySelector('#add-form'),
	movieInput = document.querySelector('#movie'),
	messageDiv = document.querySelector('#message'),
	moviesHTML = document.querySelector('.movies');

let movies = [];

movies = [
	{ title: 'The Godfather (1972)', currentStars: '' },
	{ title: 'The ShawshankRedemption (1983)', currentStars: '' },
	{ title: 'The Dark Knight (2008)', currentStars: '' },
	{ title: '12 Angry Men (1957)', currentStars: '' },
	{ title: "Schindler's (1993)", currentStars: '' },
	{ title: 'The Lord of the Rings (1999)', currentStars: '' }
];

// Event Listners
document.addEventListener('DOMContentLoaded', localStorageOnLoad);

addForm.addEventListener('submit', submitForm);

moviesHTML.addEventListener('mouseover', mouseoverStars);

moviesHTML.addEventListener('mouseout', mouseoutStars);

moviesHTML.addEventListener('click', clickStars);

// Functions

function submitForm(e) {
	e.preventDefault();

	// read the form data
	let movieTitle = movieInput.value;

	// Validate the form
	if (movieTitle === '') {
		messageDiv.innerHTML = 'Please, write the title of a movie';
		messageDiv.classList.add('error');
		setTimeout(function() {
			messageDiv.innerHTML = '';
			messageDiv.classList.remove('error');
		}, 3000);
	} else {
		const resultDiv = document.querySelector('#movies');
		const newMovie = { title: movieTitle, currentStars: '' };
		addMovieLocalStorage(newMovie);
		createResultTemplate(resultDiv, newMovie);
		this.reset();
	}
}

function displayMovies(movies) {
	// Insert the results
	const resultDiv = document.querySelector('#movies');
	resultDiv.innerHTML = '';
	movies.forEach(function(movie) {
		createResultTemplate(resultDiv, movie);
	});
	movies.forEach(function(movie) {
		const moviesHTML = Array.prototype.slice.call(document.querySelectorAll('.movie'));
		moviesHTML.forEach(function(movieHTML) {
			if (movie.title === movieHTML.firstElementChild.innerHTML) {
				const starsHTML = Array.prototype.slice.call(movieHTML.firstElementChild.nextElementSibling.children);
				starsHTML.forEach(function(starHTML) {
					if (starHTML.getAttribute('data-id') <= movie.currentStars) {
						starHTML.classList.add('checked');
					}
				});
			}
		});
	});
}

// Create Result Template
function createResultTemplate(container, movie) {
	container.innerHTML +=
		'<div class="movie">' +
		'<p class="movie__title">' +
		movie.title +
		'</p>' +
		'<ul class="stars">' +
		'<li class="star fa fa-star" data-id="0"></li>' +
		'<li class="star fa fa-star" data-id="1"></li>' +
		'<li class="star fa fa-star" data-id="2"></li>' +
		'<li class="star fa fa-star" data-id="3"></li>' +
		'<li class="star fa fa-star" data-id="4"></li>' +
		'</ul>' +
		'</div>';
}

function mouseoverStars(e) {
	if (e.target.classList.contains('star')) {
		const starsList = Array.prototype.slice.call(e.target.parentElement.children);
		const selectedStar = e.target;
		const currentStar = selectedStar.getAttribute('data-id');
		starsList.forEach(function(star) {
			star.classList.remove('hover');
			if (star.getAttribute('data-id') <= currentStar) {
				star.classList.add('hover');
			}
		});
	}
}

function mouseoutStars(e) {
	if (e.target.classList.contains('star')) {
		const starsList = Array.prototype.slice.call(e.target.parentElement.children);
		starsList.forEach(function(star) {
			star.classList.remove('hover');
		});
	}
}

// Rate the movie

function clickStars(e) {
	if (e.target.classList.contains('star')) {
		const starsList = Array.prototype.slice.call(e.target.parentElement.children);
		const selectedStar = e.target;
		const currentStar = selectedStar.getAttribute('data-id');
		let moviesList = getMoviesFromStorage();
		let sortedMovies = [];

		moviesList.forEach(function(movie) {
			if (movie.title === e.target.parentElement.previousElementSibling.innerHTML) {
				movie.currentStars = currentStar;
			}
			sortedMovies.push(movie);
		});
		starsList.forEach(function(star) {
			star.classList.remove('checked');
			if (star.getAttribute('data-id') <= currentStar) {
				star.classList.add('checked');
			}
		});

		sort(sortedMovies);
	}
}

// Adds the movies into the local storage

function addMovieLocalStorage(movie) {
	let moviesList = getMoviesFromStorage();

	// Add the movie into array
	moviesList.push(movie);

	// Convert movie array into String
	localStorage.setItem('movies', JSON.stringify(moviesList));
}

function getMoviesFromStorage() {
	let moviesList;
	const moviesLS = localStorage.getItem('movies');
	//Get the values, if null is returned then we create an array
	if (moviesLS === null) {
		moviesList = [];
	} else {
		moviesList = JSON.parse(moviesLS);
	}
	return moviesList;
}

// Prints Local Storge Movies onLoad
function localStorageOnLoad() {
	let moviesList = getMoviesFromStorage();

	if (moviesList.length === 0) {
		movies.forEach(function(movie) {
			addMovieLocalStorage(movie);
		});
	}

	moviesList = getMoviesFromStorage();

	displayMovies(moviesList);
}

// Sort Array

function sort(array) {
	let arrayCase4 = [],
		arrayCase3 = [],
		arrayCase2 = [],
		arrayCase1 = [],
		arrayCase0 = [],
		arrayCaseEmpty = [],
		sortedArr = [];

	array.forEach(function(item) {
		switch (item.currentStars) {
			case '4':
				arrayCase4.push(item);
				break;
			case '3':
				arrayCase3.push(item);
				break;
			case '2':
				arrayCase2.push(item);
				break;
			case '1':
				arrayCase1.push(item);
				break;
			case '0':
				arrayCase0.push(item);
				break;
			case '':
				arrayCaseEmpty.push(item);
				break;
			default:
				console.log('Not Found!');
		}
	});

	sortByTitle(arrayCase4);
	sortByTitle(arrayCase3);
	sortByTitle(arrayCase2);
	sortByTitle(arrayCase1);
	sortByTitle(arrayCase0);
	sortByTitle(arrayCaseEmpty);

	array = [];

	sortedArr = array.concat(arrayCase4, arrayCase3, arrayCase2, arrayCase1, arrayCase0, arrayCaseEmpty);

	localStorage.clear();
	sortedArr.forEach(function(movie) {
		addMovieLocalStorage(movie);
	});

	let moviesList = getMoviesFromStorage();
	displayMovies(moviesList);
}

// Sort Movies by Title

function sortByTitle(movies) {
	movies.sort(function(a, b) {
		return a.title.localeCompare(b.title);
	});
}
