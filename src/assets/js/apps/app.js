let saveables = [];
function saveToDatabase(app) {
    if (!app) return;
    let payload = {};
    for (let saveable of saveables) {
        let $e = saveable.$e;
        payload[saveable.saveKey] = $e.spectrum('get').toHexString ? $e.spectrum('get').toHexString() : ($e.val() === 'on' || $e.val() === 'off' ? $e.prop('checked') : $e.val());
    }
    payload.app = app;
    network.send('appConfigSave', payload);
}

function toId(name) {
    let name2 = name.replace(/[!?@#$%^&*()\-_=+\\/|\[\]{}`~;:'",.<>]+/g, ' ');
    let result = '';
    if (name2.includes(' ')) {
        for (let word of name2.split(' ')) {
            result += (result === '' ? word.charAt(0).toLowerCase() : word.charAt(0).toUpperCase()) + word.substring(1, word.length).toLowerCase();
        }
    } else {
        result += name2.toLowerCase();
    }
    return result.trim();
}

function showMenu(menuItem) {
    $(`#app__menu .current`).hide();
    $(`#app__menu .current`).removeClass('current');
    $(`#app__menu-${toId(menuItem.name)}`).show();
    $(`#app__menu-${toId(menuItem.name)}`).addClass('current');
}

function populateMenu(menuItem, hidden) {
    $('#app__menu').append(`<div id="app__menu-${toId(menuItem.name)}"></div>`);
    if (hidden)
        $(`#app__menu-${toId(menuItem.name)}`).hide();
    let sections = Array.from(menuItem.sections);
    for (let section of sections) {
        $(`#app__menu-${toId(menuItem.name)}`).append(`<h4>${section.name}</h4>`);
        $(`#app__menu-${toId(menuItem.name)}`).append(`<div id="app__menu-${toId(menuItem.name)}__section-${toId(section.name)}" class="app__menu__section" style="${section.scroll ? 'overflow-y:scroll;max-height:30em;margin-left:2em;' : 'margin-left:2em;'}"></div>`);
        for (let option of section.options) {
            switch (option.type) {
            case 'button':
                $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}`).append(`<button id="app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}" class="${option.classList}" style="margin-right: 0.5em">${option.name}</button>`);
                $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}`).click(function() { option.action.call(this); });
                break;
            case 'color':
                $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}`).append(`
                    <div style="display:flex;align-items:center;margin-bottom:1em;">
                        <h5 style="margin:0 2em 0em 0;">${option.name}</h5>
                        <input type="text" subtype="color" id="app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}" value="${option.default}" />
                    </div>
                `);
                $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}`).spectrum({
                    color: option.default,
                    showPalette: true,
                    showInitial: true,
                    showInput: true,
                    cancelText: 'Cancel',
                    chooseText: 'Done'
                });
                initializeTextboxes();
                saveables.push({
                    $e: $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}`),
                    saveKey: option.saveKey || `app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}`
                });
                break;
            case 'switch':
                $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}`).append(`
                    <div class="switch">
                        <input id="app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}" type="checkbox"  ${option.default ? 'checked="checked"' : ''} />
                        <label for="app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}">
                            <span></span>
                            ${option.name}
                        </label>
                    </div>`);
                    saveables.push({
                        $e: $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}`),
                        saveKey: option.saveKey || `app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}`
                    });
                break;
            case 'textbox':
                $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}`).append(`
                    <div class="textbox" style="${option.maxWidth ? 'max-width:' + option.maxWidth : ''}">
                        <input type="${option.inputType}" id="app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}" value="${option.default || ''}" ${option.readOnly ? 'readonly' : ''}>
                        <label for="app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}">
                            <span>${option.name}</span>
                        </label>
                    </div>`);
                if (option.clickToCopy) {
                    $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}`).click(function() {
                        $(this).select();
                        document.execCommand('copy');
                        notify.me({
                            subheader: 'Copied!',
                            timeout: 2000,
                            queue: true,
                            buttons: []
                        });
                    });
                }
                initializeTextboxes();
                saveables.push({
                    $e: $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}`),
                    saveKey: option.saveKey || `app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}`
                });
                break;
            case 'textarea':
                $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}`).append(`
                    <div class="textarea">
                        <textarea id="app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}" value="${option.default || ''}" ${option.readOnly ? 'readonly' : ''}>${option.default || ''}</textarea>
                        <label for="app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}">
                            <span>${option.name}</span>
                        </label>
                    </div>`);
                initializeTextboxes();
                saveables.push({
                    $e: $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}`),
                    saveKey: option.saveKey || `app__menu-${toId(menuItem.name)}__section-${toId(section.name)}__option-${toId(option.name)}`
                });
                break;
            case 'note':
                $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}`).append(`<blockquote>${option.name}</blockquote>`);
                break;
            case 'custom':
                $(`#app__menu-${toId(menuItem.name)}__section-${toId(section.name)}`).append(option.html);
                break;
            }
        }
    }
}

function addToSideBar(menuItem) {
    $('#app__sidebar').append(`<button id="app__sidebar__button-${toId(menuItem.name)}" class="medium app__sidebar__button">${menuItem.name}</button>`);
    $(`#app__sidebar__button-${toId(menuItem.name)}`).click(function() {
        if (!$(this).hasClass('selected')) {
            showMenu(menuItem);
            $(this).siblings('button').not($(this).attr('id')).removeClass('selected');
            $(this).addClass('selected'); 
        }
    });
}

function renderAppConfiguration(menuItems) {
    let index = 0;
    for (let menuItem of menuItems) {
        addToSideBar(menuItem);
        if (index > 0)
            populateMenu(menuItem, true);
        index++;
    }
    $(`.app__sidebar__button`).first().addClass('selected');
    populateMenu(menuItems[0], false);
    showMenu(menuItems[0]);
}

let manuallyMappedKeys = [{
    key: 'apiKey',
    elementId: '#app__menu-api__section-publicApiKey__option-publicApiKey'
}];
network
    .on('appConfigLoadComplete', function(config) {
        if (config)
            for (let key in config) {
                let element = manuallyMappedKeys.find(_ => _.key === key);
                let $e = $(`#${key}`);
                if (element)
                    $e = $(element.elementId);
                if ($e.length) {
                    switch (config[key]) {
                        case true:
                        case false:
                            $e.prop('checked', config[key]);
                            break;
                        default:
                            if ($e.attr('subtype') === 'color') { 
                                $e.spectrum('destroy');
                                $e.spectrum({
                                    color: config[key],
                                    showPalette: true,
                                    showInitial: true,
                                    showInput: true,
                                    cancelText: 'Cancel',
                                    chooseText: 'Done'
                                });
                            }
                            $e.attr('value', config[key]);
                            $e.val(config[key]);
                            break;
                    }
                }
            }
        if (appConfigLoadComplete)
            appConfigLoadComplete();
    });