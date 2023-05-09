/*
 * This utility file does not and should not contain anything app specific!
 */

/*
 * Global Variables
 */
let hooks = {
    scroll: [],
    resize: [],
    afterResize: []
};
let mouse = {
    x: 0,
    y: 0
};
let loadingSelector, fullscreenElement;

/*
 * Global Functions
 */
// Starts the transition to a white screen.
function startLoaderTransition(callback) {
    $(loadingSelector).fadeTo(150, 1);
    setTimeout(() => callback(), 200);
}

// Transitions smoothly to a white screen before redirecting to the specified url.
function redirect(url) {
    if (url !== '' && url !== '#')
        startLoaderTransition(() => window.location.href = url);
}

function hasAcceptedCookies() {
    const acceptedCookies = getCookie('acceptedCookies');
    return acceptedCookies && acceptedCookies === 'true';
}

function htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

// Sets a cookie for a specified number of days.
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (encodeURIComponent(value) || "")  + expires + "; path=/";
}

// Gets a cookie by name.
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length,c.length));
    }
    return null;
}

// Compeletly erases a cookie.
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

// Returns a random integer between two numbers, inclusively.
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setFullscreenElement($e) {
    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    ) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        fullscreenElement = null;
    } else {
        element = $e.get(0);
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
        fullscreenElement = $e;
    }
}

function createUUID() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}  

function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function storeScrollPosition() {
    if (localStorage) {
        const varName = 'previousScrollPosition';
        localStorage.setItem(varName, $(document).scrollTop());
    }
}

function restoreScrollPosition() {
    if (localStorage) {
        const varName = 'previousScrollPosition';
        const pos = localStorage.getItem(varName);
        if (pos) {
            $(document).scrollTop(pos);
            localStorage.removeItem(varName);
        }
    }
}

$(window).on('beforeunload', storeScrollPosition);
$(window).on('load', restoreScrollPosition);

/*
 * On-Ready
 */
$(function() {
    /*
     * On-Scroll
     */
    const doc = $(document);
    doc.on('scroll', function() {
        const w = $(window);
        const event = {
            position: {
                top: doc.scrollTop(), // The position of the top of the window -- this increases as you scroll down.
                bottom: doc.outerHeight() - doc.scrollTop() - w.height(), // The position of the bottom of the window -- this decreases as you scroll down.
            }
        };
        for (const h in hooks.scroll) {
            h.callback.call(h.$, event);
        }
    });
    let resizeTimeout, currentlyResizing, lastWidth = $(window).width;
    setInterval(() => {
        const w = $(window);
        const width = w.width();
        if (width !== lastWidth) {
            lastWidth = width;
            clearTimeout(resizeTimeout);
            currentlyResizing = true;
            const event = {
                size: {
                    width: width,
                    height: w.height(),
                }
            };
            for (let h in hooks.resize) {
                h.callback.call(h.$, event);
            }
            if (currentlyResizing)
                resizeTimeout = setTimeout(() => {
                    currentlyResizing = false;
                    if (hooks.afterResize.length)
                        for (let h of hooks.afterResize) {
                            if (h.callback)
                                h.callback.call(h.$, event);
                        }
                }, 1000);
        }
    }, 100);
    doc.on('mousemove', function (e) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });
});

/*
 * JQuery Extensions
 */
jQuery.fn.extend({
    scroll: function(callback) {
        return this.each(function() {
            if (!hooks.scroll.find(_ => _.$.id == this.id))
                hooks.scroll.push({
                    $: this,
                    callback
                });
        });
    },
    resize: function(callback) {
        return this.each(function() {
            if (!hooks.resize.find(_ => _.$.id == this.id))
                hooks.resize.push({
                    $: this,
                    callback
                });
        });
    },
    afterResize: function(callback) {
        return this.each(function() {
            if (!hooks.afterResize.find(_ => _.$.id == this.id))
                hooks.afterResize.push({
                    $: this,
                    callback
                });
        });
    },
    rightClick: function(callback, preventDefault = true) {
        return this.each(function() {
            $(this).contextmenu(function(e) {
                const event = {
                    mouse: {
                        x: mouse.x,
                        y: mouse.y
                    },
                    target: e.target
                };
                callback(event);
                if (preventDefault) {
                    e.preventDefault(); 
                    return false;
                }
            });
        });
    },
    leftClick: function(callback, preventDefault = true) {
        return this.each(function() {
            $(this).click(function(e) {
                const event = {
                    mouse: {
                        x: mouse.x,
                        y: mouse.y
                    },
                    target: e.target,
                    $this: $(this)
                };
                callback(event);
                if (preventDefault) {
                    e.preventDefault(); 
                    return false;
                }
            });
        });
    },
    inclusiveEquals: function($target) { // Returns true if either the source or target is a direct, complete subset of the other. Basically, this is a way of doing "$(A) === $(B)" _for the most part_. 
        const $source = $(this);
        let sourceArray = $source.toArray();
        let targetArray = $target.toArray();
        let count = 0;
        if (sourceArray.length === 0 || targetArray.length === 0)
            return false;
        if (sourceArray.length > targetArray) {
            sourceArray = $target.toArray();
            targetArray = $source.toArray();
        }
        for (const e of sourceArray) {
            if (targetArray.includes(e)) {
                count++;
                continue;
            }
        }
        return (count === sourceArray.length);
    }
});