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
    const links = [
        'eenvandaag.avrotros.nl',
        'www.weerplaza.nl',
        'www.nos.nl',
    ]
    for (let span of spans) {
        for (let link of links) {
            makeOneExternalLink(span, link);
        }
    }
}

export {makeExternalLinks}
