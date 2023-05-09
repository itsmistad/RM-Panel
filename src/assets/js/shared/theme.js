/*
 * theme.js
 * 
 * This script contains a collection of all the app-specific variables and functions
 * that are used by the application for the theme of the website.
 */

/*
 * App's Theme Selectors
 */
let selector = {
    layout: {
        header: '#layout__header',
        main: '#layout__main',
        footer: '#layout__footer',
    },
    loading: {
        container: '#loading__container',
        img: '#loading__img'
    },
    home: {
        mainBanner: '#home__main-banner',
        lowerContent: '#home__lower-content'
    }
};
loadingSelector = selector.loading.container;

/*
 * App's Theme Variables
 */
const layer = {
    loadingScreen: 10000
};

const color = {
    lightAccent: '#ddd0f1',
    accent: '#A589D1',
    darkAccent: '#8664BA',
    header: '#1e1b1e',
    body: '#494848',
    links: '#68adef',
    highlighted: '#2191fb',
    background: '#F2F3F4',
    success: '#27BA56',
    error: '#ba274a',
    dark: {
        header: '#2D2F2F',
        logo_glow: '#A589D1',
        shadow: '#444444',
        background: '#4D5050',
        bodyText: '#E8EDED',
        headerText: '#FFFFFF',
        lightAccent: '#4335558',
        headerButton: '#575B5B'
    }
};

const font = {
    header: "'Montserrat', Arial",
    body: "'Roboto', 'Courier New'",
    quote: "'Courier New'"
};

const transition = {
    smooth: "200ms cubic-bezier(.4,.0,.23,1)",
    smoothSlower: "350ms cubic-bezier(.4,.0,.6,1)"
};

/*
 * App's Shared Classes
 * ----------------------
 * This object exists for programmatic purposes.
 * If you ever need to insert an element programmatically,
 * it's easier to use shared classes rather than
 * define the same styles over-and-over.
 */
let classes = {
    bold: 'bold',
    column: 'column',
    columnReverse: 'column-reverse',
    fullCenter: 'full-center',
    fullFrame: 'full-frame',
    fullHidden: 'full-hidden',
    fullViewHeight: 'full-view-height',
    fullWidth: 'full-width',
    hidden: 'hidden',
    hideScroll: 'hide-scroll',
    left: 'left',
    lower: 'lower',
    right: 'right',
    required: 'required',
    row: 'row',
    rowReverse: 'row-reverse',
    spaced: 'spaced',
    stretch: 'stretch',
    textCenter: 'text-center',
    textLeft: 'text-left',
    textRight: 'text-right',
    upper: 'upper'
};

/*
 * App's Theme Functions
 */
// Toggles the scrollbar for a specified JQuery element.
function toggleScrollBar($e) {
    $e.toggleClass(classes.hideScroll);
}

let manifest;
function getManifest() {
    network.get('/manifest/rev-manifest.json', null, function(response) {
        manifest = response;
    });
}

function saveJsonToDatabase(path, json) {
    network.post(path, json, () => {}, true);
}

let vars = {};
function assignVar(name, partial) {
    vars[name] = Object.freeze(JSON.parse(partial.replace(/&quot;/g,'"')));
}

// Converts an HTML string into plaintext format
function htmlToPlainText(html) {
    let result = html;
    result = result.replace(/<style([\s\S]*?)<\/style>/gi, '');
    result = result.replace(/<script([\s\S]*?)<\/script>/gi, '');
    result = result.replace(/<\/div>/ig, '\n');
    result = result.replace(/<\/li>/ig, '\n');
    result = result.replace(/<ul>/ig, '');
    result = result.replace(/<\/ul>/ig, '');
    result = result.replace(/<ol>/ig, '');
    result = result.replace(/<\/ol>/ig, '');
    result = result.replace(/<li>/ig, '  *  ');
    result = result.replace(/<\/ul>/ig, '\n');
    result = result.replace(/<\/p>/ig, '\n');
    result = result.replace(/<br\s*[\/]?>/gi, "\n");
    result = result.replace(/<[^>]+>/ig, '');
    return result;
}

// Set the "value" attributes and "required" formatting for any textbox on the page. Call this when you add any textbox through JS.
function initializeTextboxes(onChange, onChangeContext) {
    const textBoxes = $('input[type="text"], input[type="email"], input[type="date"], input[type="time"], input[type="number"], textarea');
    textBoxes.off('change');

    // Observe all Quill containers.
    $('.quill').each(function() {
        let options = {
            theme: 'snow',
            modules: {
                toolbar: `#${$(this).siblings('.toolbar').attr('id')}`
            }
        };
        let quill = new Quill(`#${$(this).attr('id')}`, options);
    });

    // Initialized the value attribute if it's missing for each textbox.
    textBoxes.each(function() {
        if ((!$(this).attr('value') || $(this).attr('value').trim() === '') && $(this).text && $(this).attr('value') !== $(this).text())
            $(this).attr('value', $(this).text());
        else if ((!$(this).attr('value') || $(this).attr('value').trim() === '') && $(this).val && $(this).attr('value') !== $(this).val())
            $(this).attr('value', $(this).val());
    });

    // Updates the value attribute for each textbox on-change.
    textBoxes.change(function() {
        $(this).attr('value', $(this).val());
        if (onChange && onChangeContext) {
            onChangeContext.$e = $(this);
            onChange.call(onChangeContext);
        }
    });
 
    // Adds an asterick next to any textbox that is marked as required.
    textBoxes.each(function() {
        if ($(this).prop('required')) {
            $(this).siblings('label').append(`<span class="${classes.required}">*</span>`);
        }
    });
}

if (user.googleId) {
    overrideLoading();
}

$(function() {
    if (!hasAcceptedCookies()) {
        notify.me({
            header: 'Cookie Policy',
            subheader: `<a href="/policies/cookies">Read our cookie policy</a>`,
            body: 'RM Panel uses cookies to provide you the best planning experience.<br/>By continuing to use our website, you accept our use of cookies.',
            buttons: [{
                text: 'Ok',
                class: 'medium',
                close: true,
                action: () => {
                    setCookie('acceptedCookies', 'true', 7);
                }
            }]
        });
    }

    $('#header__button-logo').click(function(e) {
        redirect('/');
        e.preventDefault();
        return;
    });

    // If the page is loaded from browserSync, track changes to textbox values over-the-network.
    if (window.location.href.includes('3001')) {
        setInterval(() => {
            const textBoxes = $('input[type="text"], input[type="email"], input[type="date"], input[type="time"], textarea');
            textBoxes.each(function() {
                if ($(this).attr('value') !== $(this).val())
                    $(this).attr('value', $(this).val());
            });
        }, 250);
    }

    // Prevents anchor elements from immediately redirecting. Replaces the behavior with a smooth transition.
    $('a').click(function(e) {
        e.preventDefault();
        if ($(this).attr('href')) redirect($(this).attr('href'));
        return false;
    });

    initializeTextboxes();
    
    // Transitions templatized ".page" elements (h1 and .banner) in on page load.
    $('.page>h1').addClass('up');
    $('.page>.banner').addClass('up');

    if (user.googleId) {
        const loginBtn = $('#header__button-login');
        loginBtn.removeAttr('href');
        loginBtn.off('click');
        loginBtn.attr('href', `/user/profile?googleId=${user.googleId}`);
        const phrases = ['Welcome', 'Howdy', 'Hi', 'Hey', 'Hello'];
        const index = getRandomInt(0, phrases.length - 1);
        phrase = phrases[index];
        loginBtn.html(`<div>${phrase}, ${user.displayName || user.firstName}!</div><img src="${user.picture}">`);
    
        contextly.init('#header__button-login', '#layout__main', [{
            text: 'Logout',
            href: '/auth/logout',
            action: () => {
                redirect('/auth/logout');
            }
        }, {
            text: 'Profile',
            href: `/user/profile?googleId=${user.googleId}`,
            action: () => {
                redirect(`/user/profile?googleId=${user.googleId}`);
            }
        },{
            text: 'Dashboard',
            href: '/dashboard',
            action: () => {
                redirect('/dashboard');
            }
        }], {
            showOnLeftClick: true
        });
        finishLoading();
    }
});

if (user.notifySound || user.notifySound == null) {
    notify.initSound('default', '/files/notify.mp3');
}

notify.initNetwork();