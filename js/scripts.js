// variables
var elForm = $_('.js-form');
var elSearch = $_('.js-search', elForm);
var elCatagories = $_('.js-catagories', elForm);
var elRating = $_('.js-imdb-rating', elForm);
var elSort = $_('.js-sort', elForm);

// movies box
var elMovies = $_('.movies');
var elMovieTemplate = $_('#movie-template').content;
var elAlertTemplate = $_('#alert-template').content;
var elBookmarkTemplate = $_('#bookmark-template').content;
var resultNumberWrapper = $_('.result-number-wrapper');

// bookmark
var bookmarks = [];
var elMovieBookmarks = $_('.js-movie-bookmarks');
var elMovieBookmarkTitle = $_('.js-movie-bookmark-title');
var elMovieBookmarkRemove = $_('.js-movie-bookmark-remove');

// clean movies object
var editedMovies = movies.map(function(movie, index) {
	return {
		id: index + 1,
		title: movie.Title.toString(),
		catagories: movie.Categories,
		year: movie.movie_year,
		summary: movie.summary,
		rating: movie.imdb_rating,
		ytLink: `https://www.youtube.com/watch?v=${movie.ytid}`,
		imageUrl: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
    bigImageUrl: `http://i3.ytimg.com/vi/${movie.ytid}/maxresdefault.jpg`,
	};
});

// create array for movies
var movieArray = [];

// append all movies to the page
var moviesFragment = document.createDocumentFragment();

// function: return part of movies in the fragment
var appendMoviesToFragment = function(movie) {
	var newElMovieTemplate = elMovieTemplate.cloneNode(true);

	newElMovieTemplate.querySelector('.movie').title = movie.title;
	newElMovieTemplate.querySelector('.movie__title').textContent = movie.title;
	newElMovieTemplate.querySelector('.movie__year').textContent = movie.year;
	newElMovieTemplate.querySelector('.movie__rating').textContent = movie.rating;
	newElMovieTemplate.querySelector('.movie__catagory').textContent = movie.catagories.split('|');
	newElMovieTemplate.querySelector('.movie__catagory').title = movie.catagories;
	newElMovieTemplate.querySelector('.movie__youtube-link').href = movie.ytLink;
	newElMovieTemplate.querySelector('.modal-button').dataset.id = movie.id;

	return newElMovieTemplate;
}

//***************************CATAGORIES**************************//
// sorted catagories
var selectCatagories = editedMovies.map(function(movie) {
	return movie.catagories.split('|');
});

// get all catagories from movies and delete duplicate ones
var finalCatagories = [];
selectCatagories.forEach(function(catagory) {
	catagory.forEach(function(eachCatagory) {
		if(!finalCatagories.includes(eachCatagory)) {
			finalCatagories.push(eachCatagory);
		}
	});
});

// append only pure catagories
finalCatagories.sort();
finalCatagories.forEach(function(catagory) {
	var elNewOption = document.createElement('option');
	elNewOption.value = catagory;
	elNewOption.textContent = catagory;

	elCatagories.append(elNewOption);
});


//**************************SEARCH**************************//
elForm.addEventListener('submit', function(evt) {
	evt.preventDefault();

	movieArray = editedMovies.slice();

	// create RegEx word
	var regExpWord = new RegExp(elSearch.value.trim(), 'gi');

	// Array: matched movies by search key
	movieArray = movieArray.filter(function(movie) {
		return movie.title.match(regExpWord);
	});

	// select catagory
	if(Boolean(elCatagories.value)) {
		var selectedCatagoryRegExp =  new RegExp(elCatagories.value, 'gi');

		movieArray =  movieArray.filter(function(movie) {
			return movie.catagories.match(selectedCatagoryRegExp);
		});
	}

	// select sort
	if(Boolean(elSort.value)) {
		switch(elSort.value) {
			case 'rating_asc':
			case 'rating_desc':
				movieArray = sortObjectRating(movieArray, elSort.value);
				break;
			case 'az':
			case 'za':
				movieArray = sortObjectName(movieArray, elSort.value);
				break;
			case 'year_asc':
			case 'year_desc':
				movieArray = sortObjectYear(movieArray, elSort.value);
				break;
		}
	}

	// sort by imdb rating
	if(Boolean(parseFloat(elRating.value, 10))) {
		movieArray = movieArray.filter(function(movie) {
			return movie.rating >= elRating.value;
		});
	}

	// append movies to the fragment box
	movieArray.forEach(function(movie) {
		moviesFragment.append(appendMoviesToFragment(movie));
	});

	// add fragment box to the body
	elMovies.innerHTML = '';
	elMovies.append(moviesFragment);

	// count movies
	var newElAlertTemplate = elAlertTemplate.cloneNode(true);
	newElAlertTemplate.querySelector('.js-result-num').textContent = movieArray.length;
	resultNumberWrapper.innerHTML = newElAlertTemplate.firstElementChild.outerHTML;
});

// append movies to the fragment box
movieArray = editedMovies.slice(0, 50);

movieArray.forEach(function(movie) {
	moviesFragment.append(appendMoviesToFragment(movie));
});

// add fragment box to the body
elMovies.append(moviesFragment);

// create event delagation with modal button
// modal variables
var elModalMovieTitle = $_('.js-modal-movie-title');
var elModalMovieSummary = $_('.js-modal-movie-summary');
var elModalMovieYear = $_('.js-modal-movie-year');
var elModalMovieImdb = $_('.js-modal-movie-imdb');
var elModalMovieImg = $_('.js-modal-movie-img');

// fill modal template
var fillModalTemplate = function(getDataById, movieArray) {
	var foundMovie = movieArray.find(function(movie) {
		return getDataById == movie.id;
	});

	elModalMovieTitle.textContent = foundMovie.title;
	elModalMovieSummary.textContent = foundMovie.summary;
	elModalMovieYear.textContent = foundMovie.year;
	elModalMovieImdb.textContent = foundMovie.rating;
	elModalMovieImg.src = foundMovie.bigImageUrl;
}

// create new elements from template
var createNewBookmarkEl = function(array) {
	var bookmarksFragment = document.createDocumentFragment();

	array.forEach((movie) => {
		var newBookmarkItem = elBookmarkTemplate.cloneNode(true);

		newBookmarkItem.querySelector('.js-movie-bookmark-title').dataset.movieId = movie.id;
		newBookmarkItem.querySelector('.js-movie-bookmark-title').textContent = movie.title;
		bookmarksFragment.append(newBookmarkItem);
	});
	
	elMovieBookmarks.innerHTML = '';
	elMovieBookmarks.append(bookmarksFragment);
}

// listen wrapper of movies - event delegation
elMovies.addEventListener('click', (evt) => {
	// if modal-button is pressed, get movie id and search from movieArray, get movie object, push it to modal
	if(evt.target.matches('.modal-button')) {
		var getDataById = evt.target.dataset.id;
		
		fillModalTemplate(getDataById, movieArray);
	}

	// if bookmark button is pressed: get movie object by dataset.id and push to array. Then append to dropdown menu
	if(evt.target.matches('.bookmark-button')) {
		var movieId = evt.target.previousElementSibling.dataset.id;

		var foundMovie = movieArray.find((movie) => {
			return movie.id == movieId;
		});

		var isMovieBookmarked = false;
		for(var movie of bookmarks) {
			if(movie.id == movieId) {
				isMovieBookmarked = true;
				break;
			}
		}

		if(!isMovieBookmarked) {
			bookmarks.push(foundMovie);
		}

		createNewBookmarkEl(bookmarks);
	}
});

// if elMovieBookmarkRemove button pressed remove bookmarked movie from the array and list
elMovieBookmarks.addEventListener('click', (evt) => {
	var movieId = Number(evt.target.previousElementSibling.dataset.movieId);
	
	evt.target.closest('.bookmark-movie').remove();
	
	bookmarks.some(function(movie, index) {
		return movie.id === movieId ? bookmarks.splice(index, 1) : false;
	});
});
