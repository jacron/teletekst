import {
    initNewsLines,
    prepareNavigationList,
} from "./newsLines.js";
import {goBack, initHistory, writeHistory} from "./history.js";
import {config} from "./config.js";
import {makeExternalLinks} from "./externalLinks.js";
import {handleKeyInput, isNumber} from "./keyinput.js";
import {hackLinks} from "./onderRegel.js";

function adjustOneLink(link) {
    const href = link.getAttribute('href');
    if (href && href.startsWith('/')) {
        link.addEventListener('click', e => {
            const isBlauwNummer = link.classList.contains('cyan') && isNumber(link.textContent);
            if (isBlauwNummer) {
                alert(config.msgBlauwNietOproepbaar);
            } else {
                let url = config.teletekstHome + href;
                /* 'pagina niet gevonden'? */
                if (href.indexOf('?p') === -1) {
                    url = config.teletekstStart;
                }
                init(url);
            }
            e.preventDefault();
            return true;
        })
    }
}

function adjustLinks() {
    const links = document.body.getElementsByTagName('a');
    for (let link of links) {
        adjustOneLink(link)
    }
}

function keydownListener(e) {
    const bindings = [
        ['F1', 'fastText1Red'],
        ['F2', 'fastText2Green'],
        ['F3', 'fastText3Yellow'],
        ['F4', 'fastText4Blue']
    ]
    for (let binding of bindings) {
        const [key, id] = binding;
        if (key === e.key) {
            const link = document.getElementById(id);
            link.classList.add('onderregel');
            link.click();
        }
    }
}

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

/* Het originele script verwijderen is niet echt nodig, daar de src niet werkt zo.
Het maakt de source echter functioneel duidelijker. */
function removeOriginalScript(container) {
    let script = container.querySelector('script');
    // console.log(script)  // src=/webplus.html/v6/teletekst-txt.min.js
    container.removeChild(script);
}

function inject(text) {
    const parser = new DOMParser();
    const HTMLDocument = parser.parseFromString(text, 'text/html');
    const container = document.getElementById('container');
    container.innerHTML = HTMLDocument.body.innerHTML;
    removeOriginalScript(container);
    initNewsLines();
    hackLinks();
    makeExternalLinks();
    adjustLinks();
    hideControls();
    prepareNavigationList();
    container.addEventListener('keydown', keydownListener);
    handleSubmit();
    handleBack();
    document.getElementById('navi').focus();
}

function init(url) {
    writeHistory(url);
    fetch(url + queryAgainstCaching(), {mode: 'no-cors'})
        .then(res => res.text())
        .then(text => inject(text))
        .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', function () {
    initHistory();
    init(config.teletekstStart);
});
document.onkeydown = function (event) {
    handleKeyInput(event).then(url => init(url));
};
