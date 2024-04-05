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

export {makeExternalLinks}
