import {goBack, writeHistory} from "./history.js";
import {adjustOnderregel, fromStorage} from "./onderRegel.js";
import {initNewsLines, prepareNavigationList} from "./newsLines.js";
import {handleInternalLinks} from "./handleInternalLinks.js";
import {makeExternalLinks} from "./externalLinks.js";
import {config} from "../../config.js";

function handleSubmit() {
    const form = document.querySelector('form');
    const input = form.querySelector('input[type=tel]')
    form.addEventListener('submit', e => {
        const inputValue = input.value;
        if (inputValue.length && inputValue.length === 3) {
            const url = config.teletekstHome + '/webplus/?p=' + inputValue;
            fetchPage(url, 'container');
        }
        e.preventDefault();
        return true;
    })
}

function handleBack() {
    const backButton = document.querySelector('#navigatie .back');
    backButton.addEventListener('click', e => {
        goBack().then(url => fetchPage(url, 'container'));
        e.preventDefault();
    })
}

function inject(text, containerId) {
    const parser = new DOMParser();
    const HTMLDocument = parser.parseFromString(text, 'text/html');
    const container = document.getElementById(containerId);
    if (containerId === 'container2') {
        const titleLine = HTMLDocument.body.querySelector('.yellow.bg-blue');
        if (titleLine) {
            const title = titleLine.cloneNode(true);
            title.classList.add('pretitle');
            container.innerHTML = '';
            container.appendChild(title);
            setTimeout(() => {
                container.innerHTML = HTMLDocument.body.innerHTML;
            }, 300);
        } else { /* not found heeft geen title regel */
            container.innerHTML = '';
            setTimeout(() => {
                container.innerHTML = HTMLDocument.body.innerHTML;
            }, 100)
        }
    } else {
        container.innerHTML = HTMLDocument.body.innerHTML;
        fromStorage().then(storedOpties => {
                initNewsLines();
                adjustOnderregel(storedOpties);
                handleInternalLinks(fetchPage, containerId);
                makeExternalLinks();
                prepareNavigationList();
                handleSubmit();
                handleBack();
                document.getElementById('navi').focus();
        })
    }
}

function showMessageLoading(visible, msg) {
    const message = document.getElementById('message');
    if (msg) {
        message.textContent = msg;
    }
    message.style.display = visible? 'block' : 'none';
}

function queryAgainstCaching() {
    const date = new Date();
    return '&time=' + date.getTime();
}

function fetchPage(url, containerId) {
    showMessageLoading(true);
    writeHistory(url);
    fetch(url + queryAgainstCaching(), {mode: 'no-cors'})
        .then(res => res.text())
        .then(text => {
            inject(text, containerId);
            showMessageLoading(false);
        })
        .catch(err => {
            console.error(err)
            // showMessageLoading(false)
        });
}

export {fetchPage}
