function setTitleWithTime() {
    const now = new Date();
    document.title = 'NOS Teletekst - ' +
        now.getHours() + ':' +
        now.getMinutes();
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
        } else {
            console.log('unknown id', hack[0]);
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

function weerplaza() {
    const spans = document.getElementsByTagName('span');
    for (let span of spans) {
        makeLink(span, 'www.weerplaza.nl');
        makeLink(span, 'www.nos.nl')
    }
}
window.scrollTo(0, 60);
setTitleWithTime();
hackLinks();
weerplaza();
