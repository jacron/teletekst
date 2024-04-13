import {config} from "../../config.js";

const fKeyBindings = [
    ['F1', 'fastText1Red'],
    ['F2', 'fastText2Green'],
    ['F3', 'fastText3Yellow'],
    ['F4', 'fastText4Blue']
]
const onderregelTemplate = `<pre>
<span class="red "><a id="fastText1Red" class="red" href="/webplus?p=101"> nieuws </a></span><span class="green "><a id="fastText2Green" class="green" href="/webplus?p=102"> binnenland </a></span><span class="yellow "><a id="fastText3Yellow" class="yellow" href="/webplus?p=103"> buitenland </a></span><span class="cyan "><a id="fastText4Blue" class="cyan" href="/webplus?p=601"> sport  </a></span>
</pre>`;
const defaultOptiesString = '[[" nieuws","101"],[" actualiteiten ","220"],["documentaire  ","228"],["weer ","702"]]';

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
    if (state && opties) {
        if (!document.getElementById(fKeyBindings[0][1])) {
            injectOnderregel();
        }
        console.log(opties)
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
    } else {
        state = false;
        opties = defaultOptiesString;
        _adjustOnderregel(opties, state)
    }
}

export {adjustOnderregel}
