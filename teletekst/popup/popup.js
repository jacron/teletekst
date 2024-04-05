const teletekstHome = 'https://teletekst-data.nos.nl';
/* real url: https://nos.nl/teletekst#101_01 */
const teletekstStart = teletekstHome + '/webplus/?p=101-1';
const teletekstPagina = teletekstHome + '/webplus/?p=';
const KEY_URL_HISTORY = 'url_history';
const HISTORY_DELIMITER = '%';

const newsLines = {
    lines: [],
    index: -1
}

function initNewsLines() {
    newsLines.index = -1;
    newsLines.lines = [];
}

function getAnchor(newsline) {
    /* p 102 bevat anchor in span */
    let a = newsline.querySelector('a');
    if (!a) {
        /* p 101 bevat anchor in volgende (sibling) span */
        const nextSpan = newsline.nextElementSibling;
        a = nextSpan.querySelector('a');
    }
    return a;
}

function prepareNavigationList() {
    const spans = document.getElementsByTagName('span');
    for (let span of spans) {
        const hasColor = span.classList.contains('cyan') || span.classList.contains('yellow');
        if (hasColor && getAnchor(span)) {
            if (span.innerText.trim().indexOf(' ') !== -1) {
                span.classList.add('newsline');
                newsLines.lines.push(span);
            }
        }
    }
}

function navigateNewspage() {
    const activeSpan = newsLines.lines[newsLines.index];
    const a = getAnchor(activeSpan);
    a.click();
}

function navigateFirst() {
    if (newsLines.index !== 0) {
        clearActivations();
        activateFirst();
    }
}

function navigateLast() {
    if (newsLines.index !== newsLines.lines.length - 1) {
        clearActivations();
        activateLast();
    }
}

function navigateInto(e) {
    if (document.getElementById('navi').value.length === 0) {
        /* this is a fix to navigating to an empty number */
        e.preventDefault();
    }
    if (newsLines.index !== -1) {
        navigateNewspage();
    }
}

function activateFirst() {
    newsLines.index = 0;
    activateNewsline();
}

function activateLast() {
    newsLines.index = newsLines.lines.length - 1;
    activateNewsline();
}

function clearActivations() {
    for (let span of newsLines.lines) {
        span.classList.remove('active');
    }
}

function activateNewsline() {
    newsLines.lines[newsLines.index].classList.add('active');
}

/* navigate on ArrowUp */
function prevLine() {
    if (newsLines.index === -1) {
        activateLast();
    } else if (newsLines.index > 0) {
        clearActivations();
        newsLines.index--;
        activateNewsline();
    }
}

/* navigate on ArroDown */
function nextLine() {
    if (newsLines.index === -1) {
        activateFirst();
    } else if (newsLines.index < newsLines.lines.length -1) {
        clearActivations();
        newsLines.index++;
        activateNewsline();
    }
}

function _followLink(url) {
    if (url && url.length > 0) {
        init(teletekstHome + url);
    }
}

function expiresValue(days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    return "; expires=" + date.toGMTString();
}

/* set and getCookie is copied from the original script, and adapted */
function setCookie(name, value, days) {
    if (!days) {
        days = 1;
    }
    document.cookie = name + "=" + value + expiresValue(days) + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
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
            let url = teletekstHome + href;
            /* 'pagina niet gevonden'? */
            if (href.indexOf('?p') === -1) {
                url = teletekstStart;
            }
            init(url);
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
            document.getElementById(id).click();
        }
    }
}

function externalAnchorString(url) {
    const realUrl = 'https://' + url;
    return `<a href="${realUrl}" target="_blank" class="external-link">${url}</a>`;
}

function makeOneExternalLink(span, url) {
    let html = span.innerHTML;
    if (html.indexOf(url) !== -1) {
        span.innerHTML = html.replace(url, externalAnchorString(url));
    }
}

function makeExternalLinks() {
    const spans = document.getElementsByTagName('span');
    for (let span of spans) {
        makeOneExternalLink(span, 'www.weerplaza.nl');
        makeOneExternalLink(span, 'www.nos.nl')
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

function inject(text) {
    const parser = new DOMParser();
    const HTMLDocument = parser.parseFromString(text, 'text/html');
    const container = document.getElementById('container');
    container.innerHTML = HTMLDocument.body.innerHTML;
    initNewsLines();
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
    setCookie(KEY_URL_HISTORY, '');
    init(teletekstStart);
});
