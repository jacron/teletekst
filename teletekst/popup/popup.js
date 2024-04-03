const teletekstHome = 'https://teletekst-data.nos.nl';
const teletekstStart = teletekstHome + '/webplus/?p=101-1';  // https://nos.nl/teletekst#101_01';
const teletekstPagina = teletekstHome + '/webplus/?p=';  // https://nos.nl/teletekst#101_01';
const nativeScriptSrc = 'teletekst-txt.js';
const KEY_URL_HISTORY = 'url_history';
const HISTORY_DELIMITER = '%';

/* followLink() is migrated from teletekst-txt.js, and customized */
function followLink(link) {
    const url = link.getAttribute('href'); // attribuut is niet geprefixed, zoals .href wel
    if (url && url.length > 0) {
        init(teletekstHome + url);
    }
}

/* set en getCookie overgenomen uit oorspr. script */
function setCookie(name, value, days) {
    let expires = "";
    if (!days) {
        days = 1;
    }
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=", ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return false;
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
    handleBack();
    makeLinks();
}

function pageFromUrl(url) {
    const p = url.split('?p=');
    return p[1];
}

function urlWithPage(page) {
    return teletekstPagina + page;
}

/* N.B. Using a history like this only provides for Back, not Forward */
function goBack() {
    let history = getCookie(KEY_URL_HISTORY);
    if (history !== '') {
        const p = history.split(HISTORY_DELIMITER);
        p.pop();
        const page = p.pop();
        if (page) {
            history = p.join(HISTORY_DELIMITER);
            setCookie(KEY_URL_HISTORY, history);
            init(urlWithPage(page));
        }
    }
}

function handleBack() {
    const backButton = document.querySelector('#navigatie .back');
    backButton.addEventListener('click', e => {
        goBack();
        e.preventDefault();
    })
}

function writeHistory(url) {
    const page = pageFromUrl(url);
    let history = getCookie(KEY_URL_HISTORY);
    if (history !== '') {
        const p = history.split(HISTORY_DELIMITER);
        p.push(page)
        history = p.join(HISTORY_DELIMITER)
    } else {
        history = page;
    }
    setCookie(KEY_URL_HISTORY, history);
}

function queryAgainstCaching() {
    const date = new Date();
    return '&time=' + date.getTime();
}

function init(url) {
    writeHistory(url);
    fetch(url + queryAgainstCaching(), {mode: 'no-cors'})
        .then(res => res.text())
        .then(text => inject(text))
        .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', function () {
    setCookie(KEY_URL_HISTORY, '');
    init(teletekstStart);
});
