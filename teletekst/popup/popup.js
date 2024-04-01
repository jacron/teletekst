const teletekstHome = 'https://teletekst-data.nos.nl';
const teletekstStart = teletekstHome + '/webplus/?p=101-1';  // https://nos.nl/teletekst#101_01';

function followLink(link) {
    const url = link.getAttribute('href'); // attribuut is niet geprefixed, zoals .href wel
    console.log(url)
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
    const src = "teletekst-txt.min.js";
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('src', src);
    container.appendChild(scriptElement);
}

function keydownListener(e) {
    switch (e.key) {
        case 'F1':
            document.getElementById('fastText1Red').click();
            break;
        case 'F2':
            document.getElementById('fastText2Green').click();
            break;
        case 'F3':
            document.getElementById('fastText3Yellow').click();
            break;
        case 'F4':
            document.getElementById('fastText4Blue').click();
            break;
        }
}

function inject(text) {
    const parser = new DOMParser();
    const HTMLDocument = parser.parseFromString(text, 'text/html');
    const container = document.getElementById('container');
    container.innerHTML = HTMLDocument.body.innerHTML;
    injectScript(container);
    adjustLinks();
    document.querySelector('.font-control').style.display = 'none';
    container.addEventListener('keydown', keydownListener);
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
