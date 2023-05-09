/*
 * loading.js
 * 
 * This script contains a handler that fades in the interface when the document is ready.
 */

let ready, loadingOverriden;

// If the document is still not ready after 500 ms, show the loading animation.
setTimeout(() => {
    if (!ready) {
        $(selector.loading.img).removeClass(classes.hidden);
    }
}, 500);

// Marks the loading screen as "overridden." The loading screen will now only disappear once "finishLoading()" is called.
// Call this outside of a script's "$(function() {})" section to manage your own loading.
function overrideLoading() {
    loadingOverriden = true;
}

// Clears out the loading screen and animation.
function finishLoading() {
    ready = true;
    if ($(selector.loading.container).is(':visible')) {
        setTimeout(() => {
            setTimeout(() => {
                $(selector.loading.img).addClass(classes.hidden);
            }, 200);
            setTimeout(() => {
                $(selector.loading.container).hide();
            }, 360);
            $(selector.loading.container).addClass(classes.hidden);
        }, 100);
    }
}

$(function() {
    if (!loadingOverriden)
        finishLoading();
});