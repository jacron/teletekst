"use strict";
(function () {
    /* getCookie() disabled: don't use Cookies (don't change our ideal font size) */
    /* followLink() is migrated to popup.js, and customized */
    document.onkeydown = function (event) {
        event = event || window.event;
        handleKeyInput(event);
    };

    function followLinks(e) {
        const btns_pager = getAllElementsWithAttribute('data-pager');
        const [p_prev, sp_prev, sp_next, p_next] = btns_pager;
        // let key = {left: 37, up: 38, right: 39, down: 40, pageDown: 34, pageUp: 33};
        let link = null;
        switch (e.key) {
            case 'ArrowLeft':
            case 'PageUp':
                link = p_prev;
                break;
            case 'ArrowRight':
            case 'PageDown':
                link = p_next;
                break;
            case 'ArrowUp':
                if (sp_prev.classList.contains('disabled')) {
                    prevLine();
                } else {
                    link = sp_prev;
                }
                break;
            case 'ArrowDown':
                if (sp_next.classList.contains('disabled')) {
                    nextLine();
                } else {
                    link = sp_next;
                }
                break;
            case 'Home':
                e.preventDefault();
                navigateFirst();
                break;
            case 'End':
                e.preventDefault();
                navigateLast();
                break;
            case 'Enter':
                navigateInto(e);
                break;
        }
        if (link) {
            const url = link.getAttribute('href'); // attribuut is niet geprefixed, zoals .href wel
            _followLink(url);
        }
    }

    function handleMetaKey(e) {
        if (e.metaKey) {
            if (e.key === '[') {
                goBack();
                e.preventDefault();
            }
        }
    }

    function isNumberKey(key) {
        const regex = /^\d+$/;
        return regex.test(key);
    }

    function handleKeyInput(e) {
        if (isNumberKey(e.key)) {
            document.getElementById('navi').focus();
            return;
        }
        followLinks(e);
        handleMetaKey(e);
    }

    function getAllElementsWithAttribute(attribute) {
        let matchingElements = [];
        let allElements = document.getElementsByTagName('*');
        for (let element of allElements) {
            if (element.getAttribute(attribute)) {
                matchingElements.push(element);
            }
        }
        return matchingElements;
    }

})();
