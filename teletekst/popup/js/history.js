/* Back-navigation, using a history, stored in session-storage. */

import {config} from "../../config.js";

const KEY = config.storageKey.history;
const STORAGE = chrome.storage.session;

function urlWithUnescapedPage(page) {
    return config.teletekstPagina + page.replace(/_/g, '-');
}

function escapedPageFromUrl(url) {
    const p = url.split('?p=');
    if (p.length > 1) {
        return p[1].replace(/-/g, '_');
    } else {
        return '';
    }
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

function writeUrlToHistory(url, value) {
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
            const newHistory = writeUrlToHistory(url, results[KEY]);
            STORAGE.set({[KEY]: JSON.stringify(newHistory)}).then();
        })
}

export {goBack, writeHistory}
