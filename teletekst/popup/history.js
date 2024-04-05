import {config} from "./config.js";

const KEY_URL_HISTORY = 'url_history';
const HISTORY_DELIMITER = '%';

/* N.B. Using a history like this only provides for Back, not Forward */
function goBack() {
    return new Promise((resolve, reject) => {
        let history = getCookie(KEY_URL_HISTORY);
        if (history !== '') {
            const p = history.split(HISTORY_DELIMITER);
            p.pop();
            const page = p.pop();
            if (page) {
                history = p.join(HISTORY_DELIMITER);
                setCookie(KEY_URL_HISTORY, history);
                resolve(urlWithPage(page));
            }
        }
        reject();
    })
}

function expiresValue(days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    return "; expires=" + date.toGMTString();
}

/* set and getCookie is copied from the original script, and adapted */
function setCookie(name, value, days) {
    if (!days) {
        days = 1;
    }
    document.cookie = name + "=" + value + expiresValue(days) + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return false;
}

function pageFromUrl(url) {
    const p = url.split('?p=');
    return p[1];
}

function urlWithPage(page) {
    return config.teletekstPagina + page;
}

function writeHistory(url) {
    const page = pageFromUrl(url);
    let history = getCookie(KEY_URL_HISTORY);
    if (history !== '') {
        const p = history.split(HISTORY_DELIMITER);
        p.push(page)
        history = p.join(HISTORY_DELIMITER)
    } else {
        history = page;
    }
    setCookie(KEY_URL_HISTORY, history);
}

function initHistory() {
    setCookie(KEY_URL_HISTORY, '');
}

export {goBack, initHistory, writeHistory}
