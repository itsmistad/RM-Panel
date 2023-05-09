function appConfigLoadComplete() {
    $('#app__menu-price__section-preview').append(`
        <h5><span class="money">4.99</span></h5>
    `);
    $('#app__menu-widget__section-preview').currencyConverter($('#app__menu-api__section-publicApiKey__option-publicApiKey').val(), false, 'USD');
    $('#app__menu-checkout__section-preview').currencyMessage($('#app__menu-api__section-publicApiKey__option-publicApiKey').val(), 'XYZ');
}

network.get('/files/currencies.json', {}, function(json) { 
    let currenciesOptions = [];
    let defaultCurrencies = ['US Dollar', 'Canadian Dollar', 'Euro', 'Australian Dollar', 'British Pound Sterling'];
    for (let currency in json) {
        if (!defaultCurrencies.includes(json[currency].name)) {
            manuallyMappedKeys.push({
                key: currency,
                elementId: `#app__menu-currencies__section-availableCurrencies__option-${toId(json[currency].name)}`
            });
            currenciesOptions.push({
                name: json[currency].name,
                saveKey: currency,
                type: 'switch',
                flag: classes[currency],
                default: false
            });
        }
    }
    currenciesOptions.sort((a, b) => a.name > b.name ? 1 : (b.name > a.name ? -1 : 0));
    let queue = [];
    for (let currency in json) {
        if (defaultCurrencies.includes(json[currency].name)) {
            manuallyMappedKeys.push({
                key: currency,
                elementId: `#app__menu-currencies__section-availableCurrencies__option-${toId(json[currency].name)}`
            });
            queue.unshift({
                name: json[currency].name,
                saveKey: currency,
                type: 'switch',
                default: true
            });
        }
    }
    for (let option of queue) {
        currenciesOptions.unshift(option);
    }

    manuallyMappedKeys = manuallyMappedKeys.concat([{
        key: 'borderTopLeft',
        elementId: '#app__menu-widget__section-borderRadius__option-topLeftPx'
    }, {
        key: 'borderTopRight',
        elementId: '#app__menu-widget__section-borderRadius__option-topRightPx'
    }, {
        key: 'borderBottomLeft',
        elementId: '#app__menu-widget__section-borderRadius__option-bottomLeftPx'
    }, {
        key: 'borderBottomRight',
        elementId: '#app__menu-widget__section-borderRadius__option-bottomRightPx'
    }, {
        key: 'borderColor',
        elementId: '#app__menu-widget__section-colors__option-border'
    }, {
        key: 'borderHoverColor',
        elementId: '#app__menu-widget__section-colors__option-borderHover'
    }, {
        key: 'backgroundColor',
        elementId: '#app__menu-widget__section-colors__option-background'
    }, {
        key: 'backgroundHoverColor',
        elementId: '#app__menu-widget__section-colors__option-backgroundHover'
    }, {
        key: 'dropdownArrowColor',
        elementId: '#app__menu-widget__section-colors__option-dropdownArrow'
    }, {
        key: 'dropdownArrowHoverColor',
        elementId: '#app__menu-widget__section-colors__option-dropdownArrowHover'
    }, {
        key: 'textColor',
        elementId: '#app__menu-widget__section-colors__option-text'
    }, {
        key: 'textHoverColor',
        elementId: '#app__menu-widget__section-colors__option-textHover'
    }, {
        key: 'regionDetection',
        elementId: '#app__menu-widget__section-toggles__option-automaticRegionDetection'
    }, {
        key: 'flagNextToCurrency',
        elementId: '#app__menu-widget__section-toggles__option-flagNextToCountrySCurrency'
    }, {
        key: 'currencyMessage',
        elementId: '#app__menu-checkout__section-message__option-currencyMessage'
    }, {
        key: 'enableCurrencyMessage',
        elementId: '#app__menu-checkout__section-message__option-enableCurrencyMessage'
    }, {
        key: 'pricePrecision',
        elementId: '#app__menu-price__section-decimal__option-precision'
    }, {
        key: 'messageBorderColor',
        elementId: '#app__menu-checkout__section-colors__option-border'
    }, {
        key: 'messageBackgroundColor',
        elementId: '#app__menu-checkout__section-colors__option-background'
    }, {
        key: 'messageTextColor',
        elementId: '#app__menu-checkout__section-colors__option-text'
    }]);
    let menuItems = [{
        name: 'API',
        sections: [{
            name: 'Public API Key',
            options: [{
                name: 'This is your <strong>public</strong> API key. You may share this with anyone, as it does not compromise your account. Users with this key will only be able to retrieve your configuration settings, not modify them.',
                type: 'note'
            }, {
                name: 'To copy, click the textbox.',
                type: 'note'
            }, {
                name: 'Public API Key',
                saveKey: 'apiKey',
                inputType: 'text',
                type: 'textbox',
                readOnly: true,
                clickToCopy: true,
                default: 'None'
            }, {
                name: 'Generate',
                type: 'button',
                classList: 'medium',
                action: function() {
                    let publicApiKeyField = $('#app__menu-api__section-publicApiKey__option-publicApiKey');
                    let publicApiKey = createUUID().replace(/-/g, '');
                    publicApiKeyField.attr('value', publicApiKey);
                    publicApiKeyField.val(publicApiKey);
                }
            }]
        }]
    }, {
        name: 'Currencies',
        sections: [{
            name: 'Available Currencies',
            scroll: true,
            options: currenciesOptions
        }, {
            name: 'Options',
            options: [{
                name: 'Reset to default',
                type: 'button',
                classList: 'medium',
                action: function() {
                    $('#app__menu-currencies__section-availableCurrencies input[type="checkbox"] + label').each(function() {
                        $(this).siblings('input[type="checkbox"]').prop('checked', defaultCurrencies.includes($(this).text().trim()));
                    });
                }
            }]
        }]
    }, {
        name: 'Price',
        sections: [{
            name: 'Preview',
            options: []
        }, {
            name: 'Decimal',
            options: [{ 
                name: 'This is the number of decimal places prices will be rounded to.',
                type: 'note'
            }, {
                name: 'Precision',
                inputType: 'number',
                type: 'textbox',
                maxWidth: '10em',
                default: '2',
                saveKey: 'pricePrecision'
            }]
        }]
    }, {
        name: 'Checkout',
        sections: [{
            name: 'Preview',
            options: []
        }, {
            name: 'Message',
            options: [{ 
                name: '<strong>{{ currentCurrency }}</strong> -> the currency the user has currently chosen.<br><strong>{{ storeCurrency }}</strong> -> the currency the store is set to.',
                type: 'note'
            },{
                name: 'Currency Message',
                type: 'textarea',
                default: 'Although your cart is in {{ currentCurrency }}, all orders are processed in {{ storeCurrency }}. Proceeding with checkout will have your items processed in {{ storeCurrency }} with the most current exchange rate.',
                saveKey: 'currencyMessage'
            }, {
                name: 'Enable currency message',
                type: 'switch',
                default: true,
                saveKey: 'enableCurrencyMessage'
            }]
        }, {
            name: 'Colors',
            options: [{
                name: 'Border',
                type: 'color',
                default: '#747474',
                saveKey: 'messageBorderColor'
            }, {
                name: 'Background',
                type: 'color',
                default: '#F2F3F4',
                saveKey: 'messageBackgroundColor'
            }, {
                name: 'Text',
                type: 'color',
                default: '#3D3D3D',
                saveKey: 'messageTextColor'
            }]
        }]
    }, {
        name: 'Widget',
        sections: [{
            name: 'Preview',
            options: []
        }, {
            name: 'Border Radius',
            options: [{
                name: 'Top-Left (px)',
                inputType: 'number',
                type: 'textbox',
                maxWidth: '10em',
                default: '10',
                saveKey: 'borderTopLeft'
            }, {
                name: 'Top-Right (px)',
                inputType: 'number',
                type: 'textbox',
                maxWidth: '10em',
                default: '10',
                saveKey: 'borderTopRight'
            }, {
                name: 'Bottom-Left (px)',
                inputType: 'number',
                type: 'textbox',
                maxWidth: '10em',
                default: '10',
                saveKey: 'borderBottomLeft'
            }, {
                name: 'Bottom-Right (px)',
                inputType: 'number',
                type: 'textbox',
                maxWidth: '10em',
                default: '10',
                saveKey: 'borderBottomRight'
            }]
        }, {
            name: 'Colors',
            options: [{
                name: 'Border',
                type: 'color',
                default: '#747474',
                saveKey: 'borderColor'
            }, {
                name: 'Border (Hover)',
                type: 'color',
                default: '#2C4051',
                saveKey: 'borderHoverColor'
            }, {
                name: 'Background',
                type: 'color',
                default: '#F2F3F4',
                saveKey: 'backgroundColor'
            }, {
                name: 'Background (Hover)',
                type: 'color',
                default: '#d5dfe9',
                saveKey: 'backgroundHoverColor'
            }, {
                name: 'Dropdown Arrow',
                type: 'color',
                default: '#3D3D3D',
                saveKey: 'dropdownArrowColor'
            }, {
                name: 'Dropdown Arrow (Hover)',
                type: 'color',
                default: '#2C4051',
                saveKey: 'dropdownArrowHoverColor'
            }, {
                name: 'Text',
                type: 'color',
                default: '#3D3D3D',
                saveKey: 'textColor'
            }, {
                name: 'Text (Hover)',
                type: 'color',
                default: '#2C4051',
                saveKey: 'textHoverColor'
            }]
        }, {
            name: 'Toggles',
            options: [{
                name: 'Automatic region detection',
                type: 'switch',
                default: true,
                saveKey: 'regionDetection'
            }, {
                name: 'Flag next to country\'s currency',
                type: 'switch',
                default: true,
                saveKey: 'flagNextToCurrency'
            }]
        }]
    }];
    renderAppConfiguration(menuItems);
    network.send('appConfigLoad', {
        app: 'currencyConverter'
    });
    $('#app__save').click(function() {
        let publicApiKeyField = $('#app__menu-api__section-publicApiKey__option-publicApiKey');
        if (publicApiKeyField.attr('value') === 'None')
            notify.me({
                header: 'Uh oh',
                subheader: 'Missing API Key',
                body: 'You must generate a public API key before you can save your configuration.',
                buttons: [{
                    text: 'Ok',
                    class: 'medium',
                    close: true,
                    action: () => {},
                }]
            });
        else {
            saveToDatabase('currencyConverter'); 
            notify.me({
                queue: true,
                subheader: 'Saved!',
                buttons: [],
                timeout: 2000
            });
        }
    });
});