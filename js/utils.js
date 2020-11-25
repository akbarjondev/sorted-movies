// functions
var $_ = function(selector, node = document) {
	return document.querySelector(selector);
}
var $$_ = function(selector, node = document) {
	return document.querySelectorAll(selector);
}

// create new element
var createElement = function(newElName, elClass, elValue) {
	var elNewEl = document.createElement(newElName);
	elNewEl.setAttribute('class', elClass);
	elNewEl.textContent = elValue;

	return elNewEl;
}