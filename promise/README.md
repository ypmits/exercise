# PROMISE EXPLAINED

First read this README.md then go to [EXERCISE.md](./EXERCISE.md)

First thing first **WHAT ARE PROMISES**

When searching in google and typing in "what are promises javascript" you get this awnser.

    The promise constructor takes one argument, a callback with two parameters,
    resolve and reject. Do something within the callback, perhaps async, then call
    resolve if everything worked, otherwise call reject. Like throw in plain old JavaScript,
    it's customary, but not required, to reject with an Error object.

This is TECHNICALLY correct, it realy does not explain its correlation to existing methods of doing async stuff, like callbacks.

```js
// callback example
setTimeout(function(){
  alert('alert 1000ms later then being excecuted')
}, 1000);
```

## So what's all the fuss about?

JavaScript is single threaded, meaning that two bits of script cannot run at the same time; they have to run one after another. In browsers, JavaScript shares a thread with a load of other stuff that differs from browser to browser. But typically JavaScript is in the same queue as painting, updating styles, and handling user actions (such as highlighting text and interacting with form controls). Activity in one of these things delays the others.

As a human being, you're multithreaded. You can type with multiple fingers, you can drive and hold a conversation at the same time. The only blocking function we have to deal with is sneezing, where all current activity must be suspended for the duration of the sneeze. That's pretty annoying, especially when you're driving and trying to hold a conversation. You don't want to write code that's sneezy.

You've probably used events and callbacks to get around this. Here are events:

```js
var img1 = document.querySelector('.img-1');

img1.addEventListener('load', function() {
  // woo yey image loaded
});

img1.addEventListener('error', function() {
  // argh everything's broken
});
```

So now i'm going to create a library function for it

```js
function hasLoaded(querySelector, callback){
 var img1 = document.querySelector(querySelector);

 img1.addEventListener('load', function() {
   // woo yey image loaded
   callback(this);
 });

 img1.addEventListener('error', function(e) {
   // argh everything's broken
   callback(e);
 });
}
```

This will work fine with one item

```js
hasLoaded('.img-1', function(data){ // data can be a image or a error object });
```

but doing this with multple items becomes a callback hell

```js

var imagesToCheckLoading = ['.img-2','.img-2','.img-3']
var loadedImages = [];

// this is callback hell
hasLoaded(imagesToCheckLoading[0], function(data){
  if(data.tagName.toLowerCase() === 'img'){
    loadedImages.push(data);

    hasLoaded(imagesToCheckLoading[1], function(data){
      if(data.tagName.toLowerCase() === 'img'){
        loadedImages.push(data);

        hasLoaded(imagesToCheckLoading[2], function(data){
          if(data.tagName.toLowerCase() === 'img'){
            loadedImages.push(data);
          }
        });
      }
    });
  }
});

```

Doing this with a Promise makes everything a lot more readable.

```js

// creating the library function hasLoaded
function hasLoaded(querySelector){
 return new Promise(function(resolve, reject){
   var img1 = document.querySelector(querySelector);

    img1.addEventListener('load', function() {
      // woo yey image loaded
      resolve(this);
    });

    img1.addEventListener('error', function(e) {
      // argh everything's broken
      reject(e);
    });
 });
}
```

checking if images have been loaded

```js

var imagesToCheckLoading = ['.img-2','.img-2','.img-3']
var loadedImages = [];

imagesToCheckLoading.forEach(function(queryString){
    loadedImages.push(hasLoaded(imagesToCheckLoading));
})

Promise.all(loadedImages).then(function(images){
  console.log(images); // all loaded images
});

```

a even smalller way of writing this

```js

var imagesToCheckLoading = ['.img-2','.img-2','.img-3']
var loadedImages = imagesToCheckLoading.map(function(queryString){
    return hasLoaded(imagesToCheckLoading);
})

Promise.all(loadedImages).then(function(images){
  console.log(images); // all loaded images
});

```

## So why should I learn promises, again?

If the fact that promises are awesome doesn’t convince you, maybe the alternative to promises will.

Up until promises arrived, developers in JavaScript land had been using callbacks. In fact, whether you realise it or not, you’ve probably used them too! setTimeout, XMLHttpRequest, and basically all browser-based asynchronous functions are callback based.

To demonstrate the problem with callbacks, let’s do some animation, just without the HTML and CSS.

Say we want want to do the following:


1. run some code
2. wait one second
3. run some more code
4. wait another second
5. then run some more code again

This is a pattern you’d often use with CSS3 animations. Let’s implement using trusty friend setTimeout. Our code will look something like this:

```js
runAnimation(0);
setTimeout(function() {
    runAnimation(1);
    setTimeout(function() {
        runAnimation(2);
    }, 1000);
}, 1000);
```

Looks awful, right? But imagine for a moment you had 10 steps instead of 3 – you’d have so much whitespace you could build a pyramid. It gets so bad, in fact, that people have come up with a name for it – callback hell.


## But what are promises?

Perhaps the easiest way to grok promises is to work with what you already know and contrast them with callbacks. There are four major differences:

1. **Callbacks are functions, promises are objects**

   **Callbacks** are just blocks of code which can be run in response to events such as as timers going off or messages being received from the server. Any function can be a callback, and every callback is a function.

   **Promises** are objects which store information about whether or not those events have happened yet, and if they have, what their outcome is.

2. **Callbacks are passed as arguments, promises are returned**

   **Callbacks** are defined independently of the functions they are called from – they are passed in as arguments. These functions then store the callback, and call it when the event actually happens.

   **Promises** are created inside of asynchronous functions (those which might not return a response until later), and then returned. When an event happens, the asynchronous function will update the promise to notify the outside world.

3. **Callbacks handle success and failure, promises don’t handle anything**

   **Callbacks** are generally called with information on whether an operation succeeded or failed, and must be able to handle both scenarios.

   **Promises** don’t handle anything by default, but success and failure handlers are attached later.

4. **Callbacks can represent multiple events, promises represent at most one**

   **Callbacks** can be called multiple times by the functions they are passed to.

   **Promises** can only represent one event – they are either successful once, or failed once.

With this in mind, let’s jump into the details.


## The four functions you need to know
**1. new Promise(fn)**

ES6 Promises are instances of the Promise built-in, and are created by calling new Promise with a single function as an argument. For example:

```js
// Creates a Promise instance which doesn't do anything.
// Don't worry, I'll explain this in more detail in a moment.
promise = new Promise(function() {});
```

Running ```new Promise``` will immediately call the function passed in as an argument. This function’s purpose is to inform the Promise object when the event which the promise represents has resolved (i.e. successfully completed), or been rejected (i.e. failed).

In order to do so, the function you pass to the constructor can take two arguments, which are themselves callable functions – resolve and reject. Calling resolve(value) will mark the promise as resolved and cause any success handlers will be run. Call reject(error), will cause any failure handler to be run. You should not call both. resolve and reject both take an argument which represents the event’s details.

Let’s apply this to our animation example above. The above example uses the setTimeout function, which takes a callback – but we want to return a promise instead. new Promise lets us do this:

```js
// Return a promise which resolves after the specified interval
function delay(interval) {
    return new Promise(function(resolve) {
        setTimeout(resolve, interval);
    });
}

var oneSecondDelay = delay(1000);
```

Great, we’ve now got a promise which resolves after a second has passed. I know you’re probably itching to learn how to actually do something after a second has passed – we’ll get to that in a moment in the second function you need to know, promise.then.

The function we passed to new Promise in the above example takes a resolve argument, but we’ve omitted reject. This is because setTimeout never fails, and thus there is no scenario where we’d need to call reject.

But say we’re specifically interested in setting timeouts for animation, and if the animation is going to fail due to lack of browser support, we want to know immediately instead of after the timeout. If an isAnimationSupported(step) function is available, we could implement this with reject:
```js
function animationTimeout(step, interval) {
    new Promise(function(resolve, reject) {
        if (isAnimationSupported(step)) {
            setTimeout(resolve, interval);
        } else {
            reject('animation not supported');
        }
    });
}

var firstKeyframe = animationTimeout(1, 1000);
```
Finally, it is important to note that if an exception is thrown within the passed-in function, the promise will automatically be marked as rejected, with the exception object being stored as the rejected value, just as if it had been passed as the argument to reject.

One way to think of this is that the contents of each function you pass to new Promise are wrapped in a try/catch statement, like this:
```js
var promise = new Promise(function(resolve, reject) {
    try {
        // your code
    }
    catch (e) {
        reject(e)
    }
});
```
So. Now you understand how to create a promise. But once we have one, how do we handle success/failure? We use it’s then method.

**2. promise.then(onResolve, onReject)**

`promise.then(onResolve, onReject)` allows us to assign handlers to a promise’s events. Depending on which arguments you supply, you can handle success, failure, or both:

```js
// Success handler only
promise.then(function(details) {
    // handle success
});

// Failure handler only
promise.then(null, function(error) {
    // handle failure
});

// Success & failure handlers
promise.then(
    function(details) { /* handle success */ },
    function(error) { /* handle failure */ }
);
```
**Tip**: Don’t try and handle errors from the onResolve handler in the onError handler of the same then, it doesn’t work.

```js
// This will cause tears and consternation
promise.then(
    function() {
        throw new Error('tears');
    },
    function(error) {
        // Never gets called
        console.log(error)
    }
);
```
If this is all promise.then did, it wouldn’t really have any any advantage over callbacks. Luckily, it does more: handlers passed to promise.then don’t just handle the result of the previous promise – whatever they return is turned into a new promise.

promise.then always returns a promise
Naturally, this works with numbers, strings and any old value:

```js
delay(1000)
    .then(function() {
        return 5;
    })
    .then(function(value) {
        console.log(value); // 5
    });
```
But more importantly, it also works with other promises – returning a promise from a then handler passes that promise through to the return value of then. This allows you to chain promises:
```js
delay(1000)
    .then(function() {
        console.log('1 second elapsed');
        return delay(1000);
    })
    .then(function() {
        console.log('2 seconds elapsed');
    });
```
And as you can see, chained promises no longer cause callback pyramids. No matter how many levels of callback hell you’d be in for, the equivalent promises code is flat.

Can you use what you’ve learned so far to flatten the animation example from before, using the above delay function? I’ve written it out again for your convenience – once you’ve had a shot you can check your work by touching or hovering over the blank box below.
```js
runAnimation(0);
setTimeout(function() {
    runAnimation(1);
    setTimeout(function() {
        runAnimation(2);
    }, 1000);
}, 1000);

runAnimation(0);
delay(1000)
    .then(function() {
        runAnimation(1);
        return delay(1000);
    })
    .then(function() {
        runAnimation(2);
    });
```
Edit & run this code

Which one do you find easier to understand? The promise version, or the callback version? Let me know in the comments!

While everything so far has been relatively straightforward, there are a couple of things which trip people up. For example:

Rejection handlers in promise.then return resolved promises, not rejected ones.
The fact that rejection handlers return a resolved promise by default caused me a lot of pain when I was first learning – don’t let it happen to you. Here is an example of what to watch out for:
```js
new Promise(function(resolve, reject) {
    reject(' :( ');
})
    .then(null, function() {
        // Handle the rejected promise
        return 'some description of :(';
    })
    .then(
        function(data) { console.log('resolved: '+data); },
        function(error) { console.error('rejected: '+error); }
    );
```
What does this print to the screen? Once you’re certain, check your answer by touching or hovering over the empty box below:

resolved: some description of 🙁

Edit & run the above code

The take-away here is that if you want to process your errors, make sure you don’t just return the processed value: reject the processed value. So, instead of:

return 'some description of :('
Use this magic incarnation to return a failed promise with a given value instead of a successful one:

// I'll explain this a little later
return Promise.reject({anything: 'anything'});
Alternatively, if you can throw an error, you can utilise the fact that

promise.then turns exceptions into rejected promises
This means that you can cause a handler (either success or failure) to return a rejected promise by doing this:

throw new Error('some description of :(')
Keep in mind that just like the function passed to new Promise, any exception thrown within the handlers passed to promise.then will be turned into a rejected promise – as opposed to landing in your console like you might expect. Because of this, it is important to make sure that you finish each then chain with a rejection-only handler – if you leave this out, you’ll invariably spend hours pulling your hair out over missing error messages (see Are JavaScript Promises swallowing your errors? for another solution).

Here is a contrived example to demonstrate this point:
```js
delay(1000)
    .then(function() {
        throw new Error("oh no.");
    })
    .then(null, function(error) {
        console.error(error);
    });

```
This is so important, in fact, that there is a shortcut. It happens to be function number three:

**3. promise.catch(onReject)**
This one is simple. promise.catch(handler) is equivalent to promise.then(null, handler).

No seriously, thats all there is to it.

One pattern you’re generally going to want to follow is to put a catch at the end of each of your then chains. Let’s go back to the animation example to demonstrate.

Say we’ve got a 3-step animation, with a 1 second gap between each step. Each step could throw an exception – say, due to lack of browser support – so we’ll follow each then with a catch containing a backup function which causes the same changes without animation.

Can you write this using delay from above, assuming that each animation step can be called with runAnimation(number), and each backup step can be called with runBackup(number)? Treat each step separately, in case the browser can run some of the animations, but not all of them. Give it a shot, and if you get stuck, touch or hover over the blank box below for an answer.

```js
try {
    runAnimation(0);
}
catch (e) {
    runBackup(0);
}

delay(1000)
    .then(function() {
        runAnimation(1);
        return delay(1000);
    })
    .catch(function() {
        runBackup(1);
    })
    .then(function() {
        runAnimation(2);
    })
    .catch(function() {
        runBackup(2);
    });
```
How does your answer compare with mine? If you’re unsure about why I’ve done it the way I have, leave a comment!

One interesting thing in the above example is the similarity between the try/catch block and the promise blocks. Some people like to think about promises as a kind of delayed try/catch block – I don’t, but I guess it can’t hurt.

Aaand, that wraps up the three functions you need to know to use promises. But to use them well, you need to know four.

**4. Promise.all([promise1, promise2, …])**
Promise.all is amazing. What it accomplishes is so painful using callbacks that I chickened out from even writing a callback-based example, yet the abstraction it provides is so simple.

What does it do? It returns a promise which resolves when all of it’s argument promises have resolved, or is rejected when any of it’s argument promises are rejected. The returned promise resolves to an array containing the results of every promise, or fails with the error with which the first promise was rejected.

What is it useful for? Well, say we wanted to animate two things in parallel, followed by a third in series.
```
parallel animation 1  \
                                      + - subsequent animation
parallel animation 2  /
```
You could rip your hair out doing this with callbacks. You could find, download and include a 3rd-party library which makes it a little easier.

Or, you could just use Promise.all.

Let’s say that we have three functions which start an animation and return promises which resolve when the animation is done – parallelAnimation1(), parallelAnimation2() and finalAnimation(). The above flow can be implemented as follows:
```
Promise.all([
    parallelAnimation1(),
    parallelAnimation2()
]).then(function() {
    finalAnimation();
});
```
Simple, right?

-----

Smiley faces used for exercise are [designed by Vitaly Gorbachev from Flaticon](https://www.flaticon.com/authors/vitaly-gorbachev)

# Disclaimer
This is a combination of copy from the following locations
 - http://jamesknelson.com/grokking-es6-promises-the-four-functions-you-need-to-avoid-callback-hell/
 - https://developers.google.com/web/fundamentals/primers/promises

This is purly intended as a internal excersize at where i work for fellow colleages.