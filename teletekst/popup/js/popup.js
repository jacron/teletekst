import {config} from "../../config.js";
import {handleKeyInput} from "./keyinput.js";
import {fetchPage} from "./fetchPage.js";
import {openPopup2} from "../../lib/openpopup2.js";
import {getMyType, myTypes} from "./search.js";
import {fromStorage} from "./onderRegel.js";

function messageListener(req) {
    if (req.message === 'close-panel') {
        window.close();
    }
}

function toPopup2() {
    const btn = document.getElementById('popup2');
    btn.addEventListener('click', () => {
        openPopup2();
        window.close();
    })
    if (getMyType() === myTypes.POPUP2) {
        document.getElementById('popup2').style.display = 'none';
    }
}

document.onkeydown = function (event) {
    handleKeyInput(event).then(url => fetchPage(url, 'container'));
};

document.addEventListener('DOMContentLoaded', () => {
    toPopup2();
    /* STARTPUNT */
    fromStorage().then(results => {
        const start = results[config.storageKey.start];
        const startPage = start? config.teletekstPagina + JSON.parse(start) : config.teletekstStart;
        fetchPage(startPage, 'container');
    })
});

chrome.runtime.onMessage.addListener(messageListener);
