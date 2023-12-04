const onderregelHtml = [
    '<span class="red "><a id="fastText1Red" class="red" href="/webplus?p=102"> binnenland</a></span>',
    '<span class="green "><a id="fastText2Green" class="green" href="/webplus?p=601">    sport  </a></span>',
    '<span class="yellow "><a id="fastText3Yellow" class="yellow" href="/webplus?p=730"> verkeer  </a></span>',
    '<span class="cyan "><a id="fastText4Blue" class="cyan" href="/webplus?p=702">  weer</a></span>  ',
];

function getPageFromHref() {
    const href = document.location.href;
    console.log(href)
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

function setTitleWithTime() {
    const now = new Date();
    document.title = 'NOS Teletekst - ' +
        now.getHours() + ':' +
        now.getMinutes();
}

function changeTitle() {
    console.log(document.title);
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

function makeLink(span, url) {
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
        makeLink(span, 'www.weerplaza.nl');
        makeLink(span, 'www.nos.nl')
    }
}

function changeStyle() {
    // Change background color to the value of immersive reader (Edge).
    document.head.innerHTML += `
    <style>
        html, body {
            background-color: #222;
        }
    </style>`;
}

function makeShortcuts() {
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
        }
    });
}

window.scrollTo(0, 60);
changeTitle();
hackLinks();
makeLinks();
changeStyle();
makeShortcuts();

