/** Code by Dave Lenz */

/**
 * Preload a list of 'image-paths' (i.e. ["./gohere/image1.png", "./gohere/image2.png" ...])
 * @param {Array} imageStrings 
 */
var ImagesPreloader = function(imageStrings)
{
	this.images = [];
	this.promises = [];

	imageStrings.forEach((url)=>{
		this.promises.push(new Promise((resolve, reject)=>{
			var img = new Image();
			img.onload = ()=>{
				resolve({url,status:'ok'})
				this.images = this;
			};
			img.onerror = (e)=>{
				resolve({url,status:'error',error:e})
			};
			img.src = url;
		}))
	});
	return Promise.all(this.promises);
}








var ImageItem = function(id, obj, useDelay = true)
{
	this.promise = null;
	this.id = id;
	this.useDelay = useDelay;
	this.img = null;
	this.size = {width:50, height:50};
	if(obj.status == "ok")
	{
		this.img = document.createElement("img");
		this.img.width = this.size.width;
		this.img.height = this.size.height;
		this.img.src = obj.url;
		this.img.style = "position:absolute";
		document.getElementById("holder").appendChild(this.img);
	}
	else
	{
		console.log("error! Check url:"+obj.url);
		// throw new Error("Oh dear");
	}
}

ImageItem.prototype.startAnimating = function(resolve, duration = .6)
{
	return this.subAnimate(duration, {right:0, top:0, delay:this.useDelay ? this.id*.05 : 0, ease:"easeInSine"})
        .then(() => {
			return this.subAnimate(duration, {right:0, top:"100%", scale:5, ease:"linear"});
		})
        .then(() => {
            return this.subAnimate(duration, {left:0, bottom:0, scale:1, ease:"linear"});
        })
        .then(() => {
            return this.subAnimate(duration, {left:0, top:0, ease:"easeOutSine"});
        })
        .then(() => {
            return this.subAnimate(duration, {xPercent:-50, yPercent:-50, left:"50%", top:"50%", scale:.1, ease:"easeInOutSine"});
        })
        .then(() => {
            return this.subAnimate(duration, {opacity:0, scale:5, ease:"easeInOutSine"}).onComplete(resolve);
		})
        .catch((error) => {
		}
	);
}
ImageItem.prototype.subAnimate = function(duration, obj)
{
	return new Promise(((resolve)=>{
		obj.onComplete = resolve;
		TweenLite.to(this.img, duration, obj);
	}));
}















/**
 * Let's start!
 */

 // make an array of all the images you want to use:
var images = [
	"./assets/001-yawn.png",
	"./assets/002-wink.png",
	"./assets/003-smile-1.png",
	"./assets/004-smile.png",
	"./assets/005-surprise.png",
	"./assets/006-shocked.png",
	"./assets/007-sceptic.png",
	"./assets/008-sad-2.png",
	"./assets/009-sad-1.png",
	"./assets/010-happy-3.png",
	"./assets/011-pain.png",
	"./assets/012-muted.png",
	"./assets/013-meh.png",
	"./assets/014-laugh.png",
	"./assets/015-ill.png",
	"./assets/016-happy-2.png",
	"./assets/017-happy-1.png",
	"./assets/018-cute.png",
	"./assets/019-crying.png",
	"./assets/020-crazy.png",
	"./assets/021-cool.png",
	"./assets/022-bored.png",
	"./assets/023-blush.png",
	"./assets/024-sad.png",
	"./assets/025-happy.png"
];

window.onload = (e)=>{
	startPreloading();
}

var preloader;
var imgNum = 0;
function startPreloading()
{
	// When the page is loaded start preloading the images:
	preloader = new ImagesPreloader(images).then((e)=>{
		console.log("All images preloaded!");

		var imgNum = 0;
		var doAllTogether = true;
		if(doAllTogether)
		{
			// When all the imgages are loaded lets go through them
			// and make a 'new ImageItem()' and put the imagestring inside them (e[i])
			var promises = [];
			for (var i = 0; i < e.length; i++) {
				promises.push(new ImageItem(i, e[i]).startAnimating(null));
			}
			Promise.all(promises).then((e)=>{
				console.log("Done animating everything (quickly)!");
			});
		}
		else
		{
			animateImageItem(imgNum, e);
		}
	});
}

function animateImageItem(imgNum, e)
{
	var imageItem = new ImageItem(imgNum, e[imgNum], false);
	imageItem.startAnimating(null, .3).then(()=>{
		imgNum++;
		if(imgNum != images.length)
		{
			animateImageItem(imgNum, e);
		} else {
			console.log("Done animating everything (slowly)!");
		}
	});
}