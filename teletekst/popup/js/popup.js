import {
    initNewsLines,
    prepareNavigationList,
} from "./newsLines.js";
import {goBack, writeHistory} from "./history.js";
import {config} from "../../config.js";
import {makeExternalLinks} from "./externalLinks.js";
import {handleKeyInput} from "./keyinput.js";
import {adjustOnderregel, fromStorage} from "./onderRegel.js";
import {handleInternalLinks} from "./handleInternalLinks.js";

function hideControls() {
    document.querySelector('.font-control').style.display = 'none';
}

function handleSubmit() {
    const form = document.querySelector('form');
    const input = form.querySelector('input[type=tel]')
    form.addEventListener('submit', e => {
        const inputValue = input.value;
        if (inputValue.length && inputValue.length === 3) {
            const url = config.teletekstHome + '/webplus/?p=' + inputValue;
            init(url);
        }
        e.preventDefault();
        return true;
    })
}

function queryAgainstCaching() {
    const date = new Date();
    return '&time=' + date.getTime();
}

function handleBack() {
    const backButton = document.querySelector('#navigatie .back');
    backButton.addEventListener('click', e => {
        goBack().then(url => init(url));
        e.preventDefault();
    })
}

function inject(text) {
    const parser = new DOMParser();
    const HTMLDocument = parser.parseFromString(text, 'text/html');
    const container = document.getElementById('container');
    container.innerHTML = HTMLDocument.body.innerHTML;
    fromStorage().then(storedOpties => {
        initNewsLines();
        adjustOnderregel(storedOpties);
        handleInternalLinks(init);
        makeExternalLinks();
        hideControls();
        prepareNavigationList();
        handleSubmit();
        handleBack();
        document.getElementById('navi').focus();
    })
}

function showMessage(visible) {
    document.getElementById('message').style.display =
        visible? 'block' : 'none';
}

function init(url) {
    showMessage(true);
    writeHistory(url);
    fetch(url + queryAgainstCaching(), {mode: 'no-cors'})
        .then(res => res.text())
        .then(text => {
            inject(text);
            showMessage(false);
        })
        .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', () => {
    init(config.teletekstStart);
});
document.onkeydown = function (event) {
    handleKeyInput(event).then(url => init(url));
};
