/*
 * contextly.js
 * 
 * This script contains the "contextly" library, a way of integrating custom themed context menus
 * that replace the default right-click menu. This script depends on the functionality from "util.js".
 */

const contextly = new function() {
    let ret = {};
    let contexts = [];
    let initialized = false;
    let currentContext;
    let baseMenuSettings = {
        minHeight: 0,
        heightFactor: 3.4,
        maxWidth: 200,
        showOnLeftClick: false
    };
    let baseOptionSet = {
        id: '',
        icon: '',
        href: '',
        animateIcon: true,
        segment: [0, 14],
        speed: 1.6,
        text: '',
        tooltip: '',
        action: e => {},
        onShow: $e => {}
    };

    function determinePositioning(containerSelector, mouseX, mouseY, minX, minY) {
        let res = {};
        let container = $(containerSelector);
        res.horizontal = 'left';
        res.vertical = 'top';
        res.x = mouseX + 2 - container.offset().left;
        res.y = mouseY + 2 - container.offset().top;
        if (res.x + minX + 10 > container.width()) {
            res.horizontal = 'right';
            res.x = container.innerWidth() - res.x;
        }
        if (res.y + minY + 10 > container.height()) {
            res.vertical = 'bottom';
            res.y = container.outerHeight() - res.y;
        }
        return res;
    }

    function showContextMenu(context, mouseX, mouseY) {
        if (currentContext) 
            hideCurrentContextMenu();
        currentContext = context;
        const result = determinePositioning(context.containerSelector, mouseX, mouseY, context.menuSettings.maxWidth, context.menuSettings.minHeight);
        let id = `contextly-menu-${Math.round(Math.random() * Math.floor(99999))}`;
        $(currentContext.containerSelector).append(`<div style="${result.vertical}:${result.y}px;${result.horizontal}:${result.x}px;max-width:${context.menuSettings.maxWidth}px" id="${id}" class="contextly-menu"><ul style="opacity:0"></ul><div>`);
        currentContext.menu = {
            id: id,
            $: $('#' + id),
            left: () => $('#' + id).offset().left,
            top: () => $('#' + id).offset().top,
            height: () => $('#' + id).innerHeight(),
            width: () => $('#' + id).innerWidth(),
        };
        setTimeout(() => currentContext.menu.$.addClass('show'), 20);
        currentContext.menu.$.animate({
            'max-height': (currentContext.options.length * currentContext.menuSettings.heightFactor) + 'em'
        }, {
            duration: 150,
            progress: function(animation) {
                const width = context.menuSettings.minWidth > animation.elem.offsetWidth ? context.menuSettings.minHeight : animation.elem.offsetWidth;
                const height = context.menuSettings.minHeight > animation.elem.offsetHeight ? context.menuSettings.minHeight : animation.elem.offsetHeight;
                const result = determinePositioning(currentContext.containerSelector, mouseX, mouseY, width, height);
                if (result.vertical === 'bottom')
                    currentContext.menu.$.css({
                        top: 'unset',
                        bottom: result.y + 'px'
                    });
                else
                    currentContext.menu.$.css({
                        bottom: 'unset',
                        top: result.y + 'px'
                    });
        
                if (result.horizontal === 'right')
                    currentContext.menu.$.css({
                        left: 'unset',
                        right: result.x + 'px'
                    });
                else
                    currentContext.menu.$.css({
                        right: 'unset',
                        left: result.x + 'px'
                    });
            }
        });
        const ul = currentContext.menu.$.find('ul');
        ul.animate({
            opacity: 1
        }, 100);
        for (const o of currentContext.options) {
            optionId = `${currentContext.menu.id}-${Math.round(Math.random() * Math.floor(99999))}`;
            let menuItem;
            if (o.href !== '')
                ul.append(`<a href="${o.href}" style="text-decoration:none"><li id="${optionId}">${o.icon !== '' ? '<span class="icon ' + o.icon + '">' : ''}</span><span class="text">${o.text}</span></li></a>`);
            else {
                ul.append(`<li id="${optionId}">${o.icon !== '' ? '<span class="icon ' + o.icon + '">' : ''}</span><span class="text">${o.text}</span></li>`);
                menuItem = $('#' + optionId);
                menuItem.rightClick(() => {});
            }
            menuItem = $('#' + optionId);
            o.onShow(menuItem);
            menuItem.click(function() {
                hideCurrentContextMenu();
                o.action({
                    id: $(this).attr('id'),
                    x: mouseX,
                    y: mouseY
                });
            });
            if (o.animateIcon && o.icon !== '') {
                const iconSpan = menuItem.find('.' + o.icon);
                const anim = lottie.loadAnimation({
                    container: iconSpan[0],
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    path: `/files/lottie/${o.icon}.json`,
                    initialSegment: o.segment
                });
                menuItem.hover(function() {
                    anim.setDirection(1);
                    anim.setSpeed(o.speed);
                    anim.play();
                }, function() {
                    anim.setDirection(-1);
                    anim.setSpeed(o.speed);
                    anim.play();
                });
            }
        }
    }

    function hideCurrentContextMenu() {
        if (currentContext) {
            currentContext.menu.$.fadeOut(200, 'swing', function() {
                $(this).remove();
            });
        }
        currentContext = null;
    }

    function onLeftClick() {
        if (currentContext &&
            (mouse.x < currentContext.menu.left() || mouse.x > currentContext.menu.left() + currentContext.menu.width() ||
            (mouse.y < currentContext.menu.top() || mouse.y > currentContext.menu.top() + currentContext.menu.height())))
            hideCurrentContextMenu();
    }

    function onRightClick(event) {
        const _ = $(event.target);
        const context = ret.find(_) || ret.find(_.parent()) || ret.find(_.parent().parent());
        const x = mouse.x;
        const y = mouse.y;
        if (!context)
            return;
        showContextMenu(context, x, y);
    }

    function hook(selector, containerSelector, showOnLeftClick) {
        if (!initialized) {
            $(containerSelector).leftClick(onLeftClick, false);
            initialized = true;
        }
        if (!showOnLeftClick)
            $(selector).rightClick(onRightClick);
        else
            $(selector).leftClick(onRightClick);
    }

    ret.find = $e => {
        return contexts.find(_ => $e.is(_.selector) || $e.attr('id') === $(_.selector).attr('id'));
    };

    ret.modify = (selector, options, menuSettings) => {
        let context = ret.find($(selector));
        if (!context)
            return;
        if (options == null) {
            console.error(`Failed to modify on selector "${selector}". Missing options.`);
            return;
        }
        let resultOptions = [];
        let resultMenuSettings = [];
        Object.assign(resultMenuSettings, baseMenuSettings);
        for (let optionSet of options) {
            let resultSet = [];
            Object.assign(resultSet, baseOptionSet);
            for (let key in optionSet) {
                if (baseOptionSet[key] == null) {
                    console.error(`Failed to parse options. Unknown key "${key}".`);
                    return;
                }
                if (toType(baseOptionSet[key]) !== toType(optionSet[key])) {
                    console.error(`Failed to parse options. Key "${key}" is not of the proper type.`);
                    return;
                }
                resultSet[key] = optionSet[key];
            }
            resultOptions.push(resultSet);
        }
        for (let key in menuSettings) {
            if (baseMenuSettings[key] == null) {
                console.error(`Failed to parse menu settings. Unknown key "${key}".`);
                return;
            }
            if (toType(baseMenuSettings[key]) !== toType(menuSettings[key])) {
                console.error(`Failed to parse menu settings. Key "${key}" is not of the proper type.`);
                return;
            }
            resultMenuSettings[key] = menuSettings[key];
        }
        context.options = resultOptions;
        context.menuSettings = resultMenuSettings;
    };

    ret.init = (selector, containerSelector, options, menuSettings) => {
        if (contexts.includes(selector)) {
            console.error(`Failed to initialize on selector "${selector}" because it's already been initialized.`);
            return;
        }
        if (typeof containerSelector === typeof []) {
            if (options != null && typeof options === typeof []) {
                menuSettings = options;
            }
            options = containerSelector;
            containerSelector = 'body';
        }
        if (options == null) {
            console.error(`Failed to initialize on selector "${selector}". Missing options.`);
            return;
        }
        let resultOptions = [];
        let resultMenuSettings = [];
        Object.assign(resultMenuSettings, baseMenuSettings);
        for (let optionSet of options) {
            let resultSet = [];
            Object.assign(resultSet, baseOptionSet);
            for (let key in optionSet) {
                if (baseOptionSet[key] == null) {
                    console.error(`Failed to parse options. Unknown key "${key}".`);
                    return;
                }
                if (toType(baseOptionSet[key]) !== toType(optionSet[key])) {
                    console.error(`Failed to parse options. Key "${key}" is not of the proper type.`);
                    return;
                }
                resultSet[key] = optionSet[key];
            }
            resultOptions.push(resultSet);
        }
        for (let key in menuSettings) {
            if (baseMenuSettings[key] == null) {
                console.error(`Failed to parse menu settings. Unknown key "${key}".`);
                return;
            }
            if (toType(baseMenuSettings[key]) !== toType(menuSettings[key])) {
                console.error(`Failed to parse menu settings. Key "${key}" is not of the proper type.`);
                return;
            }
            resultMenuSettings[key] = menuSettings[key];
        }
        hook(selector, containerSelector, resultMenuSettings.showOnLeftClick);
        contexts.push({
            selector,
            containerSelector: containerSelector,
            menuSettings: resultMenuSettings,
            options: resultOptions
        });
    }

    ret.destroy = selector => {
        $(selector).each(function() {
            this.off('contextmenu');
        });
        contexts.splice(contexts.findIndex(_ => _.selector === selector), 1);
    };

    return ret;
};

jQuery.fn.extend({
    contextly: function(containerSelector, options, menuSettings) {
        return this.each(function() {
            const _ = $(this);
            contextly.init('#' + _.attr('id'), containerSelector, options, menuSettings);
        });
    },
});