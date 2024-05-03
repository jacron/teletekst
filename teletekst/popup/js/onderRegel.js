import {config} from "../../config.js";

const STORAGE = chrome.storage.local;
const fKeyBindings = [
    ['F1', 'fastText1Red'],
    ['F2', 'fastText2Green'],
    ['F3', 'fastText3Yellow'],
    ['F4', 'fastText4Blue']
]
const fastIds = ['fastText1', 'fastText2', 'fastText3', 'fastText4'];
const onderregelTemplate = `<pre>
<span class="red "><a id="fastText1Red" class="red" href="/webplus?p=101"> nieuws </a></span><span class="green "><a id="fastText2Green" class="green" href="/webplus?p=102"> binnenland </a></span><span class="yellow "><a id="fastText3Yellow" class="yellow" href="/webplus?p=103"> buitenland </a></span><span class="cyan "><a id="fastText4Blue" class="cyan" href="/webplus?p=601"> sport  </a></span>
</pre>`;

function fKeydownListener(e) {
    for (let binding of fKeyBindings) {
        const [key, id] = binding;
        if (key === e.key) {
            const link = document.getElementById(id);
            link.click();
        }
    }
}

function injectOnderregel() {
    const container = document.getElementById('container');
    container.innerHTML += onderregelTemplate;
}

function customizeOnderregel(opties) {
    for (let i = 0; i < fKeyBindings.length; i++) {
        const link = document.getElementById(fKeyBindings[i][1]);
        link.textContent = opties[i][0];
        link.setAttribute('href', '/webplus?p=' + opties[i][1]);
    }
}

function _adjustOnderregel(opties, state) {
    if (JSON.parse(state) === true && opties) {
        if (!document.getElementById(fKeyBindings[0][1])) {
            injectOnderregel();
        }
        customizeOnderregel(JSON.parse(opties));
    }
    document.getElementById('container')
        .addEventListener('keydown', fKeydownListener);
}

function adjustOnderregel(storedOpties) {
    const {onderregel, onderregelAan} = config.storageKey;
    let opties = storedOpties[onderregel];
    let state = storedOpties[onderregelAan];
    if (opties !== undefined) {
        _adjustOnderregel(opties, state);
    }
}

function fromStorage() {
    return new Promise((resolve, reject) => {
        const {onderregel, onderregelAan, start} = config.storageKey;
        STORAGE.get([onderregel, onderregelAan, start], results => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
                return;
            }
            resolve(results);
        })
    })
}

function showFast(opties) {
    console.log(opties.length)
    for (let i = 0; i < opties.length; i++) {
        const optie = opties[i];
        const fast = document.getElementById(fastIds[i]);
        fast.style.display = 'inline-block';
        fast.textContent = optie[0];
        fast.onclick = (e) => {
            e.preventDefault();
            open(config.teletekstPagina + optie[1], '_blank');
        }
    }
    for (let span of document.querySelectorAll('.deflt')) {
        span.style.display = 'none';
    }
}

function showDefaults() {
    for (let i = 0; i < fastIds.length; i++) {
        const fast = document.getElementById(fastIds[i]);
        fast.style.display = 'none';
    }
    for (let span of document.querySelectorAll('.deflt')) {
        span.style.display = 'inline-block';
    }
}

function showLength(opties) {
    let length = 0;
    if (!opties) {
        return;
    }
    for (let optie of opties) {
        length += optie[0].length;
    }
    const totalLength = document.getElementById('totalLength');
    totalLength.textContent = length.toString();
    if (length === 41) {
        totalLength.classList.remove('red');
    } else {
        totalLength.classList.add('red');
    }
}

function showOnderregelPreview(opties) {
    if (document.getElementById('state').checked) {
        if (opties) {
            showFast(opties);
        } else {
            showDefaults();
        }
    } else {
        showDefaults();
    }
    showLength(opties);
}

export {adjustOnderregel, fromStorage, showOnderregelPreview}
