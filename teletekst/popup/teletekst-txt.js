"use strict";
(function () {
    /* getCookie() disabled: don't use Cookies (don't change our ideal font size) */
    /* followLink() is migrated to popup.js, and customized */
    document.onkeydown = function (event) {
        event = event || window.event;
        handleKeyInput(event);
    };
    document.getElementById('navi').focus();

    function handleKeyInput(ev) {
        let keyCode = ev.keyCode || ev.which;
        let key = {left: 37, up: 38, right: 39, down: 40, pageDown: 34, pageUp: 33};
        if (keyCode >= 48 && keyCode <= 57) {
            document.getElementById('navi').focus();
            return;
        }
        const btns_pager = getAllElementsWithAttribute('data-pager');
        switch (keyCode) {
            case key.left:
            case key.pageDown:
                followLink(btns_pager[0]);
                break;
            case key.right:
            case key.pageUp:
                followLink(btns_pager[3]);
                break;
            case key.up:
                followLink(btns_pager[1]);
                break;
            case key.down:
                followLink(btns_pager[2]);
                break;
        }
        if (ev.metaKey) {
            if (ev.key === '[') {
                goBack();
                ev.preventDefault();
            }
        }
    }

    function getAllElementsWithAttribute(attribute) {
        let matchingElements = [], allElements = document.getElementsByTagName('*'), len = allElements.length;
        for (let i = 0; i < len; i++) {
            if (allElements[i].getAttribute(attribute)) {
                matchingElements.push(allElements[i]);
            }
        }
        return matchingElements;
    }

})();
