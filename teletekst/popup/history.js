/* Back-navigation, using a history, stored in session-storage. */

import {config} from "../config.js";

const KEY = config.storageKey.history;
const STORAGE = chrome.storage.session;

function urlWithUnescapedPage(page) {
    return config.teletekstPagina + page.replace(/_/g, '-');
}

function escapedPageFromUrl(url) {
    const p = url.split('?p=');
    return p[1].replace(/-/g, '_');
}

function goBack() {
    return new Promise((resolve, reject) => {
        STORAGE.get(KEY)
            .then(results => {
                const value = results[KEY];
                let history;
                if (value) {
                    history = JSON.parse(value);
                    history.pop();
                    const page = history.pop();
                    if (page) {
                        STORAGE.set({[KEY]: JSON.stringify(history)})
                            .then(() => resolve(urlWithUnescapedPage(page)))
                    }
                } else {
                    reject('History is leeg.');
                }
            })
    })
}

function getHistory(url, value) {
    const page = escapedPageFromUrl(url);
    let history;
    if (value) {
        history = JSON.parse(value);
        history.push(page);
    } else {
        history = [page];
    }
    return history;
}

function writeHistory(url) {
    STORAGE.get(KEY)
        .then(results => {
            const history = getHistory(url, results[KEY]);
            STORAGE.set({[KEY]: JSON.stringify(history)}).then();
        })
}

export {goBack, writeHistory}
