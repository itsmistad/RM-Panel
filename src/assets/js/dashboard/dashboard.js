let apps = [{
    id: 'currency',
    name: 'Currency Converter',
    image: 'files/currency_converter.png'
}, {
    id: 'faq', 
    name: 'Frequently Asked Questions',
    image: 'files/faq.png'
}, {
    id: 'fbt',
    name: 'Frequently Bought Together',
    image: 'files/fbt.png'
}, {
    id: 'push',
    name: 'Push Notifications',
    image: 'files/push.png'
}, {
    id: 'discounts',
    name: 'Quantity Breaks and Discounts',
    image: 'files/discounts.png'
}, {
    id: 'urgency',
    name: 'Social Proof and Urgency',
    image: 'files/urgency.png'
}, {
    id: 'upsell',
    name: 'Upsells, Downsells, and Bundles',
    image: 'files/upsell.png'
}];

let currentApps = [];

vars.apps.forEach(_ => {
    currentApps.push(_);
    let app = apps.find(a => a.id === _);
    $('#dashboard__apps').append(`
        <div id="dashboard__app-${_}" class="dashboard__app">
            <img src="${app.image}" />
            <h5>${app.name}</h5>
        </div>
    `);
    $('#dashboard__no-apps').hide();
    if (apps.length === $('#dashboard__apps').find('.dashboard__app').length)
        $('#dashboard__add-app').hide();
    $(`#dashboard__app-${_}`).click(function() {
        redirect(`/apps/${_}`);
    });
});

$(function() {
    $('#dashboard__add-app').click(function() {
        notify.me({
            header: 'Add an App',
            subheader: 'Select an app from the dropdown',
            body: `
                <select id="dashboard__select-app">
                </select>`,
            closeButton: false,
            buttons: [{
                text: 'Add',
                class: 'medium',
                close: false,
                action: (e, notif) => {
                    let selectedOption = $('#dashboard__select-app option:selected');
                    if (selectedOption.length) {
                        let appIdentifier = selectedOption.val();
                        let appName = selectedOption.text();
                        let app = apps.find(_ => _.id === appIdentifier);
                        let imagePath = app.image;

                        currentApps.push(appIdentifier);
                        saveJsonToDatabase('/dashboard/upload', currentApps);
                        $('#dashboard__apps').append(`
                            <div id="dashboard__app-${appIdentifier}" class="dashboard__app">
                                <img src="${imagePath}" />
                                <h5>${appName}</h5>
                            </div>
                        `);
                        $('#dashboard__no-apps').hide();
                        if (apps.length === $('#dashboard__apps').find('.dashboard__app').length)
                            $('#dashboard__add-app').hide();
                        $(`#dashboard__app-${appIdentifier}`).click(function() {
                            redirect(`/apps/${appIdentifier}`);
                        });
                        notif.close();
                    }
                }
            }]
        }, () => {
            apps.forEach(function(_) {
                if (!$(`#dashboard__app-${_.id}`).length)
                    $('#dashboard__select-app').append(`<option value="${_.id}">${_.name}</option>`);
            });
        });
    });
});