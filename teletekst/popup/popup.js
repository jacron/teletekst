const teletekstHome = 'https://teletekst-data.nos.nl';
const teletekstStart = teletekstHome + '/webplus/?p=101-1';  // https://nos.nl/teletekst#101_01';
const nativeScriptSrc = 'teletekst-txt.js';

/* followLink() is migrated from teletekst-txt.js, and customized */
function followLink(link) {
    const url = link.getAttribute('href'); // attribuut is niet geprefixed, zoals .href wel
    if (url && url.length > 0) {
        init(teletekstHome + url);
    }
}

function adjustOneLink(link) {
    const href = link.getAttribute('href');
    if (href && href.startsWith('/')) {
        link.addEventListener('click', e => {
            init(teletekstHome + href);
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

function injectScript(container) {
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('src', nativeScriptSrc);
    container.appendChild(scriptElement);
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
            document.getElementById(id).click();
        }
    }
}

function makeTextToLink(span, url) {
    const text = span.textContent;
    if (text.indexOf(url) !== -1) {
        const anchor = document.createElement('a');
        anchor.textContent = text;
        span.textContent = '';
        anchor.href = 'https://' + url;
        anchor.target = '_blank';
        span.appendChild(anchor);
    }
}

function makeLinks() {
    const spans = document.getElementsByTagName('span');
    for (let span of spans) {
        makeTextToLink(span, 'www.weerplaza.nl');
        makeTextToLink(span, 'www.nos.nl')
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
            const url = teletekstHome + '/webplus/?p=' + inputValue;
            console.log(url)
            init(url);
        }
        e.preventDefault();
        return true;
    })
}

function inject(text) {
    const parser = new DOMParser();
    const HTMLDocument = parser.parseFromString(text, 'text/html');
    const container = document.getElementById('container');
    container.innerHTML = HTMLDocument.body.innerHTML;
    injectScript(container);
    adjustLinks();
    hideControls();
    container.addEventListener('keydown', keydownListener);
    handleSubmit();
    makeLinks();
}

function init(url) {
    fetch(url, {mode: 'no-cors'})
        .then(res => res.text())
        .then(text => inject(text))
        .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', function () {
    init(teletekstStart);
});
