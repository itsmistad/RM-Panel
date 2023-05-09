let stylesClasses = '';
function addClassStyles(selector, pseudoClass, additionalSelector, styles) {
    let stylesString = '';
    for (let style in styles) {
        stylesString += style + ': ' + styles[style] + ' !important;\n';
    }
    stylesClasses += `
    ${selector}${pseudoClass ? ':' + pseudoClass : ''} ${additionalSelector ? additionalSelector : ''} {
        ${stylesString}
    }\n`;
}

function renderClassStyles() {
    $('head').append(`
        <style>
            ${stylesClasses}
        </style>
    `);
}

function toggleCurrencyList(invert, opacityTarget) {
    let currencyList = $('#currency-list');
    currencyList.animate({
        opacity: opacityTarget,
    }, {
        duration: 150,
        step: function(opacity) {
            let height = $('.currency-inner-list').children('.currency-entry:visible').length * 2.25;
            if (height > 20)
                height = 20;
            $(this).css('height', (opacity * height) + 'em');
            $(this).css('transform', 'translateY(' + (invert ? ((-1 * opacity) + 0.5) : (opacity - 0.5)) + 'em) scale(' + (opacity * (1 - 0.5) + 0.5) + ')');
        }
    });
}

let updateInterval;
function updateMoneySpans(config, storeDefaultCurrency) {
    if (updateInterval)
        clearInterval(updateInterval);
    updateInterval = setInterval(function() {
        $('.money').each(function() {
            if (!$(this).attr('rm-cc-price')) {
                let price = parseFloat($(this).text());
                let currentCurrency = $('#current-currency').attr('value');
                if (storeDefaultCurrency !== currentCurrency)
                    price = Currency.convert(price, storeDefaultCurrency, currentCurrency);
                price = price.toFixed(config.pricePrecision);
                $(this).attr('rm-cc-price', $(this).text());
                $(this).text(`${price} ${currentCurrency}`)
            }
        });
    }, 1000);
}

jQuery.fn.extend({
    currencyMessage: function(apiKey, storeDefaultCurrency) {
        $.ajax({
            type: "GET",
            url: `/apps/currency/config?api_key=${apiKey}`,
            success: config => {
                if (config.enableCurrencyMessage && storeDefaultCurrency !== $('#current-currency').attr('value'))
                    $(this).append(`
                        <div id="currency-message-wrapper">
                            <div id="currency-message">
                                ${config.currencyMessage}
                            </div>
                        </div>
                    `);
                    let currencyMessage = $('#currency-message');
                    currencyMessage.text(currencyMessage.text().replace(/{{ currentCurrency }}/g, $('#current-currency').attr('value')));
                    currencyMessage.text(currencyMessage.text().replace(/{{ storeCurrency }}/g, storeDefaultCurrency));
            }
        });
    },
    currencyConverter: function(apiKey, invert, storeDefaultCurrency) {
        $.ajax({
            type: "GET",
            url: `/apps/currency/config?api_key=${apiKey}`,
            success: config => {
                $(this).append(`
                    <div class="currency-wrapper">
                        <div id="currency-converter">
                            <div id="current-currency" value="${(!config || config.regionDetection) && typeof geoplugin_currencyCode !== 'undefined' && config[geoplugin_currencyCode()] ? geoplugin_currencyCode() : storeDefaultCurrency}">
                                ${!config || config.flagNextToCurrency ? `<div id="currency-flag" class="currency-flag currency-flag-${((!config || config.regionDetection) && typeof geoplugin_currencyCode !== 'undefined' && config[geoplugin_currencyCode()] ? geoplugin_currencyCode() : storeDefaultCurrency).toLowerCase()}"></div>` : ''}
                                <h5 id="currency-name">${(!config || config.regionDetection) && typeof geoplugin_currencyCode !== 'undefined' && config[geoplugin_currencyCode()] ? geoplugin_currencyCode() : storeDefaultCurrency}</h5>
                            </div>
                            <span class="dropdown-arrow ${invert ? 'inverted' : ''}"><i class="fas fa-play"></i></span>
                        </div>
                        <div id="currency-list" class="${invert ? 'inverted' : ''}">
                            <div class="currency-inner-list">
                            </div>
                        </div>
                    </div>
                `);
                let converter = $('#currency-converter');
                converter.click(function() {
                    let currencyList = $('#currency-list');
                    $(this).toggleClass('open');
                    currencyList.toggleClass('open');
                    let opacityTarget = 1;
                    if (!currencyList.hasClass('open'))
                        opacityTarget = 0;
                    toggleCurrencyList(invert, opacityTarget);
                });
                $('body').click(function(e) {
                    if ($('#currency-list').hasClass('open') &&
                        !$(e.target).parent().parent().is('#currency-list') && 
                        !$(e.target).parent().is('#currency-list') && 
                        !$(e.target).is('#currency-list') && 
                        !$(e.target).parent().parent().is('#currency-converter') && 
                        !$(e.target).parent().is('#currency-converter') &&
                        !$(e.target).is('#currency-converter')) {
                            toggleCurrencyList(invert, 0);
                            $('#currency-converter').toggleClass('open');
                            $('#currency-list').toggleClass('open');
                        }
                });
                $.ajax({
                    type: "GET",
                    url: '/files/currency-classes.json',
                    success: classes => {
                        for (let currencyFlag in classes) {
                            if (config && !config[currencyFlag]) continue;
                            $('#currency-list .currency-inner-list').append(`
                                <div id="${classes[currencyFlag]}" class="currency-entry" value="${currencyFlag}">
                                    ${!config || config.flagNextToCurrency ? `<div class="currency-flag ${classes[currencyFlag]}"></div>` : ''}
                                    <h5 class="currency-name">${currencyFlag}</h5>
                                </div>
                            `);
                            if (currencyFlag === ((!config || config.regionDetection) && typeof geoplugin_currencyCode !== 'undefined' && config[geoplugin_currencyCode()] ? geoplugin_currencyCode() : storeDefaultCurrency))
                                $('#' + classes[currencyFlag]).hide();
                            $('#' + classes[currencyFlag]).click(function() {
                                $('#currency-list').removeClass('open');
                                toggleCurrencyList(invert, 0);
                                let targetCurrency = $('#' + classes[currencyFlag]);
                                targetCurrency.hide();
                                $(`.currency-entry[value="${$('#current-currency').attr('value')}"]`).show();
                                let currentCurrency = $('#current-currency');
                                currentCurrency.attr('value', targetCurrency.attr('value'));
                                $('#currency-flag').removeClass();
                                $('#currency-flag').addClass('currency-flag ' + classes[currencyFlag]);
                                $('#currency-name').text(currencyFlag);
                            });
                        }
                        if (config) {
                            addClassStyles('#currency-converter', null, null, {
                                'border-top-left-radius': config['borderTopLeft'] + 'px',
                                'border-top-right-radius': config['borderTopRight'] + 'px',
                                'border-bottom-left-radius': config['borderBottomLeft'] + 'px',
                                'border-bottom-right-radius': config['borderBottomRight'] + 'px',
                                'border-color': config['borderColor'],
                                'background-color': config['backgroundColor']
                            });
                            addClassStyles('#currency-converter', 'hover', null, {
                                'border-color': config['borderHoverColor'],
                                'background-color': config['backgroundHoverColor']
                            })
                            addClassStyles('#currency-converter', 'hover', '#currency-name', {
                                'color': config['textHoverColor']
                            })
                            addClassStyles('#currency-converter', 'hover', '.dropdown-arrow i', {
                                'color': config['dropdownArrowHoverColor']
                            })
                            addClassStyles('#currency-list', null, null, {
                                'border-top-left-radius': config['borderTopLeft'] + 'px',
                                'border-top-right-radius': config['borderTopRight'] + 'px',
                                'border-bottom-left-radius': config['borderBottomLeft'] + 'px',
                                'border-bottom-right-radius': config['borderBottomRight'] + 'px',
                                'border-color': config['borderColor'],
                                'background-color': config['backgroundColor']
                            });
                            addClassStyles('.currency-entry', 'hover', null, {
                                'background-color': config['backgroundHoverColor']
                            })
                            addClassStyles('.currency-entry', 'hover', '.currency-name', {
                                'color': config['textHoverColor']
                            })
                            addClassStyles('#currency-name', null, null, {
                                'color': config['textColor']
                            });
                            addClassStyles('.dropdown-arrow i', null, null, {
                                'color': config['dropdownArrowColor']
                            })
                            addClassStyles('.currency-name', null, null, {
                                'color': config['textColor']
                            });
                            renderClassStyles();
                            updateMoneySpans(config, storeDefaultCurrency);
                        }
                    }
                });
            }
        });
    }
});