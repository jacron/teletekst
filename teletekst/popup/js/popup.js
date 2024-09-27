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
        const container = document.getElementById('container');
        if (container) {
            container.classList.add('popup2');
        }
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

function calcCenteredLeft() {
    const outerWindowWidth = 1100;
    return (screen.width / 2 - (outerWindowWidth / 2));
}

const left = calcCenteredLeft()
window.moveTo(left, 0)

setTimeout(() => {
    const ttInput = document.querySelector('.tt-input');
    ttInput.onkeydown = e => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
        }
    }

}, 500)
