import {config} from "../config.js";

const onderRegelLinks = [
    'fastText1Red', 'fastText2Green', 'fastText3Yellow','fastText4Blue',
]
const fKeyBindings = [
    ['F1', 'fastText1Red'],
    ['F2', 'fastText2Green'],
    ['F3', 'fastText3Yellow'],
    ['F4', 'fastText4Blue']
]
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
    for (let i = 0; i < onderRegelLinks.length; i++) {
        const link = document.getElementById(onderRegelLinks[i]);
        link.textContent = opties[i][0];
        link.setAttribute('href', '/webplus?p=' + opties[i][1]);
    }
}

function _adjustOnderregel(storedOpties) {
    const {onderregel, onderregelAan} = config.storageKey;
    const opties = storedOpties[onderregel];
    const state = storedOpties[onderregelAan];
    if (state && opties) {
        if (!document.getElementById(onderRegelLinks[0])) {
            injectOnderregel();
        }
        customizeOnderregel(JSON.parse(opties));
    }
    document.getElementById('container').addEventListener('keydown', fKeydownListener);
}

function adjustOnderregel(storedOpties) {
    if (storedOpties) {
        _adjustOnderregel(storedOpties);
    }
}

export {adjustOnderregel}
