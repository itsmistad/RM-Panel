$(function() {
    $('#home__banner-anchor').click(function(e) {
        e.preventDefault();
        //redirect('https://www.freepik.com/free-photos-vectors/business');
        return false;
    });

    $('#home__logo').click(function(e) {
        e.preventDefault();
        redirect('/');
    });

    $('#home__dashboard').click(function(e) {
        e.preventDefault();
        redirect('/dashboard?login=1');
    });
    
    if (!isProd) {
        $('#home__theme-examples').css('display', 'flex');
    }

    switch (badLogin) {
    case 1:
        notify.me({
            header: 'Login Failed',
            subheader: 'Something went wrong',
            body: 'We were unable to authenticate your login request. Please try again later.',
            queue: true,
            timeout: 5000,
            buttons: []
        });
        break;
    case 2:
        notify.me({
            header: 'Login Failed',
            subheader: 'Something went wrong',
            body: 'We were unable to complete your login request. Please try again later.',
            queue: true,
            timeout: 5000,
            buttons: []
        });
        break;
    default:
        break;
    }
});