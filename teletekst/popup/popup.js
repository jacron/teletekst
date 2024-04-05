import {
    initNewsLines,
    navigateFirst,
    navigateInto,
    navigateLast,
    nextLine,
    prepareNavigationList,
    prevLine
} from "./newsLines.js";
import {goBack, initHistory, writeHistory} from "./history.js";
import {config} from "./config.js";

function _followLink(url) {
    if (url && url.length > 0) {
        init(config.teletekstHome + url);
    }
}

function adjustOneLink(link) {
    const href = link.getAttribute('href');
    if (href && href.startsWith('/')) {
        link.addEventListener('click', e => {
            let url = config.teletekstHome + href;
            /* 'pagina niet gevonden'? */
            if (href.indexOf('?p') === -1) {
                url = config.teletekstStart;
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
            const url = config.teletekstHome + '/webplus/?p=' + inputValue;
            console.log(url)
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

document.onkeydown = function (event) {
    handleKeyInput(event);
};

function followLinks(e) {
    const btns_pager = document.querySelectorAll('a[data-pager]');
    const [p_prev, sp_prev, sp_next, p_next] = btns_pager;
    let link = null;
    switch (e.key) {
        case 'ArrowLeft':
        case 'PageUp':
            link = p_prev;
            break;
        case 'ArrowRight':
        case 'PageDown':
            link = p_next;
            break;
        case 'ArrowUp':
            if (sp_prev.classList.contains('disabled')) {
                prevLine();
            } else {
                link = sp_prev;
            }
            break;
        case 'ArrowDown':
            if (sp_next.classList.contains('disabled')) {
                nextLine();
            } else {
                link = sp_next;
            }
            break;
        case 'Home':
            e.preventDefault();
            navigateFirst();
            break;
        case 'End':
            e.preventDefault();
            navigateLast();
            break;
        case 'Enter':
            navigateInto(e);
            break;
    }
    if (link) {
        const url = link.getAttribute('href'); // attribuut is niet geprefixed, zoals .href wel
        _followLink(url);
    }
}

function handleMetaKey(e) {
    if (e.metaKey) {
        if (e.key === '[') {
            goBack().then(url => init(url));
            e.preventDefault();
        }
    }
}

function isNumberKey(key) {
    const regex = /^\d+$/;
    return regex.test(key);
}

function handleKeyInput(e) {
    if (isNumberKey(e.key)) {
        document.getElementById('navi').focus();
        return;
    }
    followLinks(e);
    handleMetaKey(e);
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
    initHistory();
    init(config.teletekstStart);
});
