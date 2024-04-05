"use strict";
(function () {
    /* getCookie() disabled: don't use Cookies (don't change our ideal font size) */
    /* followLink() is migrated to popup.js, and customized */
    document.onkeydown = function (event) {
        event = event || window.event;
        handleKeyInput(event);
    };
    document.getElementById('navi').focus();

    function prevLine() {

    }

    function nextLine() {

    }

    function followLinks(keyCode) {
        const btns_pager = getAllElementsWithAttribute('data-pager');
        const [p_prev, sp_prev, sp_next, p_next] = btns_pager;
        let key = {left: 37, up: 38, right: 39, down: 40, pageDown: 34, pageUp: 33};
        let link = null;
        switch (keyCode) {
            case key.left:
            case key.pageDown:
                link = p_prev;
                break;
            case key.right:
            case key.pageUp:
                link = p_next;
                break;
            case key.up:
                if (sp_prev.classList.contains('disabled')) {
                    prevLine();
                } else {
                    link = sp_prev;
                }
                break;
            case key.down:
                if (sp_next.classList.contains('disabled')) {
                    nextLine();
                } else {
                    link = sp_next;
                }
                break;
        }
        if (link) {
            const url = link.getAttribute('href'); // attribuut is niet geprefixed, zoals .href wel
            _followLink(url);
        }
    }

    function handleMetaKey(ev) {
        if (ev.metaKey) {
            if (ev.key === '[') {
                goBack();
                ev.preventDefault();
            }
        }
    }

    function handleKeyInput(ev) {
        let keyCode = ev.keyCode || ev.which;
        if (keyCode >= 48 && keyCode <= 57) {
            document.getElementById('navi').focus();
            return;
        }
        followLinks(keyCode);
        handleMetaKey(ev);
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
