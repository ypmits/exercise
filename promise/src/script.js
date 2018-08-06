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
			img.onerror = ()=>{
				resolve({url,status:'error'})
			};
			img.src = url;
		}))
	});
	return Promise.all(this.promises);
}








var ImageItem = function(id, obj)
{
	this.promise = null;
	this.id = id;
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

ImageItem.prototype.animate = function()
{
	return new Promise((resolve, reject) => {
		var duration = .6;
		var tl = new TimelineMax(
			{
				onComplete:()=>{
					// this.img.style = ""; // Reset the style of the element:
					this.img.remove(); // Removes the element:
					resolve();
				}
			});
		tl.add( TweenLite.to(this.img, duration, {right:"0", y:"0", scale:3, delay:this.id*.05, ease:"easeInSine"}) );
		tl.add( TweenLite.to(this.img, duration, {right:"0", bottom:"0", scale:.5, ease:"linear"}) );
		tl.add( TweenLite.to(this.img, duration, {left:"0", bottom:"0", scale:2, ease:"linear"}) );
		tl.add( TweenLite.to(this.img, duration, {x:"0", top:"0", scale:1, ease:"easeOutSine"}) );
		tl.add( TweenLite.to(this.img, duration, {xPercent:-50, yPercent:-50, left:"50%", top:"50%", scale:.1, ease:"easeOutSine"}) );
		tl.add( TweenLite.to(this.img, duration, {opacity:0, scale:5, ease:"easeInOutSine"}) );
	});
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
	// When the page is loaded start preloading the images:
	new ImagesPreloader(images).then((e)=>{
		// When all the imgages are loaded lets go through them
		// and make a 'new ImageItem()' and put the imagestring inside them (e[i])
		var promises = [];
		console.log("All images preloaded!");
		for (var i = 0; i < e.length; i++) {
			promises.push(new ImageItem(i, e[i]).animate());
		}
		Promise.all(promises).then((e)=>{
			console.log("Done animating everything!");
		});
	});
}