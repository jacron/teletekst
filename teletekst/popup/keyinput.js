import {goBack} from "./history.js";
import {navigateFirst,
    navigateInto, navigateLast, nextLine, prevLine} from "./newsLines.js";
import {config} from "./config.js";

function followLinks(e, resolve) {
    const btns_pager = document.querySelectorAll('a[data-pager]');
    const [p_prev, sp_prev, sp_next, p_next] = btns_pager;
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
        if (url && url.length > 0) {
            resolve(config.teletekstHome + url);
        }
    }
}

function handleMetaKey(e, resolve) {
    if (e.metaKey) {
        if (e.key === '[') {
            goBack().then(url => resolve(url));
            e.preventDefault();
        }
    }
}

function isNumber(s) {
    const regex = /^\d+$/;
    return regex.test(s);
}

function handleKeyInput(e) {
    return new Promise((resolve, reject) => {
        if (isNumber(e.key)) {
            document.getElementById('navi').focus();
            return;
        }
        followLinks(e, resolve);
        handleMetaKey(e, resolve);
        // reject();
    })
}

export {handleKeyInput, isNumber}