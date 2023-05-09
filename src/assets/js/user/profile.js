let editing = false, previousValues = [];

if (!paramUser.googleId)
    redirect('/');

$(function() {
    $('#profile__picture').attr('src', paramUser.picture);
    if (paramUser.banner && paramUser.banner.trim().length)
        $('#profile__banner').css('background', `url("${paramUser.banner}") no-repeat center center`);
    $('#profile__banner').css('background-size', 'cover');
    $('#profile__about__email span').text(paramUser.email);
    if (paramUser.job && paramUser.job.trim().length) {
        $('#profile__about__job span').text(paramUser.job);
        $('#profile__about__job').show();
    }
    if (paramUser.employer && paramUser.employer.trim().length) {
        $('#profile__about__employer span').text(paramUser.employer);
        $('#profile__about__employer').show();
    }
    if (paramUser.location && paramUser.location.trim().length) {
        $('#profile__about__location span').text(paramUser.location);
        $('#profile__about__location').show();
    }
    if (paramUser.displayName && paramUser.displayName.trim().length) {
        $('#profile__display-name').text(paramUser.displayName);
    } else 
        $('#profile__display-name').addClass('full-hidden');
    $('#profile__cards').html(`<p>${paramUser.googleId === user.googleId ? 'You aren\'t' : (paramUser.displayName || paramUser.firstName) + ' isn\'t'} currently working on any cards.</p>`);
    $('#profile__projects').html(`<p>${paramUser.googleId === user.googleId ? 'You aren\'t' : (paramUser.displayName || paramUser.firstName) + ' isn\'t'} currently working on any projects.</p>`);
    $('#profile__groups').html(`<p>${paramUser.googleId === user.googleId ? 'You aren\'t' : (paramUser.displayName || paramUser.firstName) + ' isn\'t'} currently in any groups.</p>`);
    if (paramUser.friends && paramUser.friends.length) { // If the paramUser has friends...
        if (paramUser.googleId === user.googleId) { // If we are the paramUser...
            // Populate list of friends by picture icons.
            // Clicking each picture icon will bring up a notify.me of that person's info. Clicking the hyperlink will direct to their profile.
            // Clicking "See More" will open a notify.me of the entire list of friends.
        } else { // If we are not the paramUser...
            if (user.friends && user.friends.length) { // If we have friends...
                // Populate list of mutuals between us and the paramUser.
                // Icon functionality should be exactly the same as the normal friends list.
            } else {
                $('#profile__friends-text').text(`You have no mutuals with ${paramUser.displayName || paramUser.firstName}.`);
            }
        }
    } else if (paramUser.googleId === user.googleId)
        $('#profile__friends-text').text('You currently have no friends. 🙁');
    else 
        $('#profile__friends-text').text(`You have no mutuals with ${paramUser.displayName || paramUser.firstName}.`);

    if (!user.googleId || paramUser.googleId !== user.googleId) {
        $('#profile__edit-button').attr('disabled', true);
        $('#profile__edit-button').hide();
        $('#profile__friends-header').text('Mutuals');
    }

    const editIcon = 'edit-save';
    const anim = lottie.loadAnimation({
        container: document.querySelector('#profile__edit-button'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: `/files/lottie/${editIcon}.json`,
        initialSegment: [18, 45]
    });
    anim.setSpeed(2.8);
    $('#profile__edit-button').click(function() {
        editing = !editing;
        if (editing) {
            anim.setDirection(1);
            anim.play();
            $(this).attr('disabled', true);
            $('#profile__about ul').find('span').each(function() {
                let liParent = $(this).parent();
                liParent.show();
                $(this).css('overflow-x', 'unset');
                previousValues.push({
                    name: $(this).attr('name'),
                    value: $(this).text()
                });
                $(this).html(`
                    <div class="textbox" style="transform:translateY(0.7em);">
                        <input type="${$(this).attr('name') === 'Email Address' ? 'email' : 'text'}" name="${$(this).parent().attr('id')}-input" autocomplete="on" value="${$(this).text()}">
                        <label for="${$(this).parent().attr('id')}-input">
                            <span>${$(this).attr('name')}</span>
                        </label>
                    </div>
                `);
                initializeTextboxes();
            });
            $('#profile__banner-overlay').removeClass('full-hidden');
            $('#profile__picture-overlay').removeClass('full-hidden');
            previousValues.push({
                id: 'profile__display-name',
                value: $('#profile__display-name').text()
            });
            $('#profile__display-name').addClass('full-hidden');
            $('#profile__display-name-input').parent().removeClass('full-hidden');
            $('#profile__banner-overlay').click(function() {
                $('#profile__banner-file').click();
            });
            $('#profile__picture-overlay').click(function() {
                $('#profile__picture-file').click();
            });
            $('#profile__display-name-input').attr('value', $('#profile__display-name').text());
            $('#profile__banner-file').change(function(e) {
                var file = $(this)[0].files[0];
                if (!file) return;
                // Check file.size and file.type
                $('#profile__banner-overlay').addClass('show');
                upload.form(`/user/upload/banner?googleId=${paramUser.googleId}`, '#profile__banner-form', '#profile__banner-overlay', res => {
                    if (res.filePath) {
                        $('#profile__banner').css('background', `url("${res.filePath}") no-repeat center center`);
                        $('#profile__banner').css('background-size', 'cover');
                    } else {
                        notify.me({
                            header: 'Uh oh',
                            subheader: 'Something went wrong',
                            body: 'We weren\'t able to upload and update your banner. Please try again later.',
                            buttons: [{
                                text: 'Ok',
                                class: 'small',
                                close: true
                            }]
                        })
                    }
                    $('#profile__banner-overlay').removeClass('show');
                });
            });
            $('#profile__picture-file').change(function(e) {
                var file = $(this)[0].files[0];
                if (!file) return;
                // Check file.size and file.type
                $('#profile__picture-overlay').addClass('show');
                upload.form(`/user/upload/picture?googleId=${paramUser.googleId}`, '#profile__picture-form', '#profile__picture-overlay', res => {
                    if (res.filePath) {
                        $('#profile__picture').attr('src', res.filePath);
                        $('#header__button-login img').attr('src', res.filePath);
                    } else {
                        notify.me({
                            header: 'Uh oh',
                            subheader: 'Something went wrong',
                            body: 'We weren\'t able to upload and update your profile picture. Please try again later.',
                            buttons: [{
                                text: 'Ok',
                                class: 'small',
                                close: true
                            }]
                        })
                    }
                    $('#profile__picture-overlay').removeClass('show');
                });
            });
            $(this).attr('disabled', false);
        } else {
            if ($('#profile__about__email span input').is(':invalid') || !$('#profile__about__email span input').attr('value').length || !$('#profile__about__email span input').attr('value').trim().length) {
                notify.me({
                    subheader: 'Invalid Email Address',
                    body: 'Please enter a valid email address.',
                    buttons: [{
                        text: 'Ok',
                        class: 'medium',
                        close: true,
                        action: () => {
                        }
                    }]
                });
                editing = true;
                return;
            } else {
                $('#profile__about ul').find('input').each(function() {
                    if (!$(this).attr('value').length || !$(this).attr('value').trim().length) {
                        let liParent = $(this).parent().parent().parent();
                        
                        liParent.hide();
                    }
                });
                anim.setDirection(-1);
                anim.play();
                $(this).attr('disabled', true);
                let shouldSave = false;
                let previousVal, val;
                $('#profile__about ul').find('span').each(function() {
                    if (!$(this).attr('name')) return;
                    $(this).css('overflow-x', 'scroll');
                    val = $(this).find(`input[name="${$(this).parent().attr('id')}-input"]`).attr('value').trim();
                    previousVal = previousValues.find(_ => _.name === $(this).attr('name')).value.trim();
                    if (previousVal !== val) {
                        if (paramUser.googleId === user.googleId) {
                            $(this).text(val);
                            shouldSave = true;
                        } else {
                            $(this).text(previousVal);
                        }
                    } else {
                        $(this).text(previousVal);
                    }
                });
                val = $('#profile__display-name-input').attr('value').trim();
                previousVal = previousValues.find(_ => _.id === 'profile__display-name').value.trim();
                if (previousVal !== val) {
                    if (paramUser.googleId === user.googleId) {
                        $('#profile__display-name').text(val);
                        shouldSave = true;
                    } else {
                        $('#profile__display-name').text(previousVal);
                    }
                } else {
                    $('#profile__display-name').text(previousVal);
                }
                if (shouldSave) {
                    network.post(`/user/upload/about?googleId=${paramUser.googleId}`, {
                        email: $('#profile__about__email').text(),
                        job: $('#profile__about__job').text(),
                        employer: $('#profile__about__employer').text(),
                        location: $('#profile__about__location').text(),
                        displayName: $('#profile__display-name').text()
                    }, () => {}, true);
                }
                if ($('#profile__display-name').text().trim().length > 0)
                    $('#profile__display-name').removeClass('full-hidden');
                $('#profile__display-name-input').parent().addClass('full-hidden');
                $('#profile__banner-overlay').addClass('full-hidden');
                $('#profile__picture-overlay').addClass('full-hidden');
                $('#profile__banner-overlay').off('click');
                $('#profile__picture-overlay').off('click');
                $('#profile__banner-overlay').off('change');
                $('#profile__picture-overlay').off('change');
                $(this).attr('disabled', false);
            }
        }
    });

    if (getCookie('profile__help') !== 'true' && paramUser.googleId === user.googleId) {
        notify.me({
            header: 'Your Profile',
            body: 'What you\'re viewing is your public profile.<br/>To make changes, click the edit button in the top right.',
            closeButton: false,
            buttons: [{
                text: 'Ok',
                class: 'medium',
                close: true,
                action: () => {
                    setCookie('profile__help', 'true', 7);
                }
            }]
        });
    }
});