/**
 * loadImage load a image with a promise structure
 * @param url
 * @return {Promise<any>}
 */
function loadImage(url){
	return new Promise(function(resolve, reject){
		var img = document.createElement('img');
		img.onload = function(){
			resolve(this);
		}

		img.onerror = function(e){
			reject(e);
		}

		img.src = url;
	})
}

/**
 * Animate a element to a position
 * @param {HTMLElement} element
 * @param {number} duration
 * @param {number} x
 * @param {number} y
 * @return {Promise<any>}
 */
function animate(element, duration, x, y){
	return new Promise(function(resolve){
		TweenLite.to(element, duration, {x:x, y:y, onComplete: resolve})
	})
}


/// WRITE CODE UNDER HERE