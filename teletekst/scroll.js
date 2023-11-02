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
function weerplaza() {
    const spans = document.getElementsByTagName('span');
    for (let span of spans) {
        const text = span.textContent;
        if (text.indexOf('www.weerplaza.nl') !== -1) {
            console.log('weerplaza found')
            const anchor = document.createElement('a');
            anchor.textContent = text;
            span.textContent = '';
            anchor.href = 'https://www.weerplaza.nl';
            span.appendChild(anchor);
        }
    }
}
window.scrollTo(0, 60);
setTitleWithTime();
hackLinks();
weerplaza();
