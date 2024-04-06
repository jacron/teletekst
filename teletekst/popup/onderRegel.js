import {config} from "./config.js";

const onderRegelLinks = [
    'fastText1Red', 'fastText2Green', 'fastText3Yellow','fastText4Blue',
]
const KEY = config.storageKey.onderregel;
const STORAGE = chrome.storage.local;

function adjustOnderregel() {
    return new Promise((resolve) => {
        STORAGE.get(KEY, storedOpties => {
            if (storedOpties) {
                const opties = JSON.parse(storedOpties[KEY]);
                for (let i = 0; i < onderRegelLinks.length; i++) {
                    const link = document.getElementById(onderRegelLinks[i]);
                    link.textContent = opties[i][0];
                    link.setAttribute('href', '/webplus?p=' + opties[i][1]);
                }
            }
            resolve();
        })
    })
}

export {adjustOnderregel}
