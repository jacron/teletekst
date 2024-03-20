const newsLines = [];
let activatedNewsLineIndex = -1;

const onderregelHtml = [
    '<span class="red "><a id="fastText1Red" class="red" href="/webplus?p=102"> binnenland</a></span>',
    '<span class="green "><a id="fastText2Green" class="green" href="/webplus?p=601">    sport  </a></span>',
    '<span class="yellow "><a id="fastText3Yellow" class="yellow" href="/webplus?p=730"> verkeer  </a></span>',
    '<span class="cyan "><a id="fastText4Blue" class="cyan" href="/webplus?p=702">  weer</a></span>  ',
];

const css =
`.active { 
    border: 1px solid grey !important; 
}
.newsline { 
    border: 1px solid transparent; 
}
html, body {
    background-color: #222;
    line-height: 1.2;
}
`;

function getPageFromHref() {
    const href = document.location.href;
    const pos = href.indexOf('=');
    return href.substring(pos + 1);
}

function setTitleNotFound() {
    document.title = 'not found: ' + getPageFromHref() + document.title;
}

function appendOnderregel() {
    const div = document.createElement('div');
    div.innerHTML = onderregelHtml.join('');
    document.getElementById('content').appendChild(div);
}

function fillZero(n) {
    if (n < 10) return '0' + n;
    return n;
}

function setTitleWithTime() {
    const now = new Date();
    document.title = 'NOS Teletekst - ' +
        now.getHours() + ':' +
        fillZero(now.getMinutes());
}

function changeTitle() {
    if (document.title === '- NOS Teletekst') {
        setTitleNotFound();
        appendOnderregel();
    } else {
        setTitleWithTime();
    }
}

function hackLinks() {
    const hacks = [
        ['fastText1Red', ' nieuws ', 101],
        ['fastText2Green', ' actualiteit ', 220],
        ['fastText3Yellow', ' documentaire ', 228],
        ['fastText4Blue', ' weer ', 702],
    ]
    for (const hack of hacks) {
        const link = document.getElementById(hack[0]);
        if (link) {
            link.textContent = hack[1];
            link.href = '/webplus?p=' + hack[2];
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

function injectStyle() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);
}

function prepareNavigationList() {
    const spans = document.getElementsByTagName('span');
    for (let span of spans) {
        if (span.classList.contains('cyan')) {
            if (span.innerText.trim().indexOf(' ') !== -1) {
                span.classList.add('newsline');
                newsLines.push(span);
            }
        }
    }
}

function activateFirst() {
    activatedNewsLineIndex = 0;
    activateNewsline();
}

function activateLast() {
    activatedNewsLineIndex = newsLines.length - 1;
    activateNewsline();
}

function clearActivations() {
    for (let span of newsLines) {
        span.classList.remove('active');
    }
}

function activateNewsline() {
    newsLines[activatedNewsLineIndex].classList.add('active');
}

function navigateDown() {
    if (activatedNewsLineIndex === -1) {
        activateFirst();
        return;
    }
    if (activatedNewsLineIndex < newsLines.length - 1) {
        clearActivations();
        activatedNewsLineIndex++;
        activateNewsline();
    }
}

function navigateUp() {
    if (activatedNewsLineIndex === -1) {
        activateLast();
        return;
    }
    if (activatedNewsLineIndex > 0) {
        clearActivations();
        activatedNewsLineIndex--;
        activateNewsline();
    }
}

function navigateNewspage() {
    const activeSpan = newsLines[activatedNewsLineIndex];
    const nextSpan = activeSpan.nextElementSibling;
    const a = nextSpan.querySelector('a');
    a.click();
}

function navigateInto(e) {
    if (document.getElementById('navi').value.length === 0) {
        if (activatedNewsLineIndex !== -1) {
            navigateNewspage();
        }
        /* this is also a fix to navigating to an empty number */
        e.preventDefault();
    }
}

function navigateFirst() {
    if (activatedNewsLineIndex !== 0) {
        clearActivations();
        activateFirst();
    }
}

function navigateLast() {
    if (activatedNewsLineIndex !== newsLines.length - 1) {
        clearActivations();
        activateLast();
    }
}

function isNumberKey(e) {
    const regex = /^\d+$/;
    return regex.test(e.key);
}

function navigateByCapital(e) {
    if (isNumberKey(e)) {
        return;
    }
    const capital = e.key.toUpperCase();
    for (let i = 0; i < newsLines.length; i++) {
        const span = newsLines[i];
        if (span.innerText.trim().startsWith(capital)) {
            clearActivations();
            activatedNewsLineIndex = i;
            activateNewsline();
            e.preventDefault();
        }
    }
}

function handleKeyDown() {
    document.body.addEventListener('keydown', e => {
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
            case 'ArrowDown':
                e.preventDefault();
                navigateDown();
                break;
            case 'ArrowUp':
                e.preventDefault();
                navigateUp();
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
            default:
                navigateByCapital(e);
                break
        }
    });
}

changeTitle();
hackLinks();
makeLinks();
injectStyle();
handleKeyDown();
prepareNavigationList();
setTimeout(() => {
    window.scrollTo(0, 60);
}, 100);

