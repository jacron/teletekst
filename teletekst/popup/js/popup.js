import {config} from "../../config.js";
import {handleKeyInput} from "./keyinput.js";
import {fetchPage} from "./fetchPage.js";
import {openPopup2} from "../../lib/popup2.js";
import {getMyType, myTypes} from "./search.js";
import {fromStorage} from "./onderRegel.js";

const cssSidePanel = `
#container,
#container2 {
    padding: 0 8px;
    font-size: 14px;
    margin-left: -10px;
}
#container2 {
    margin-left: unset;
}
#container #content {
    height: 460px;
    width: 34em;
}
.tt-btn {
    font-size: 12px;
}
.tt-paginatie {
    height: 26px;
    transform: scale(.76);
    margin-left: -54px;
}
#help {
    display: none;
}
#message {
    top: 34px;
    left: 8px;
}
`;

function messageListener(req) {
    if (req.message === 'close-panel') {
        window.close();
    }
}

function injectSidePanelStyle() {
    const style = document.createElement('style');
    style.innerHTML = cssSidePanel;
    document.head.appendChild(style);
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
    if (document.location.search.length === 0) {
        injectSidePanelStyle()
    }
    toPopup2();
    /* STARTPUNT */
    fromStorage().then(results => {
        const start = results[config.storageKey.start];
        const startPage = start? config.teletekstPagina + JSON.parse(start) : config.teletekstStart;
        fetchPage(startPage, 'container');
    })
});

chrome.runtime.onMessage.addListener(messageListener);
