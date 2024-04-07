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
    if (newsLines.lines[newsLines.index]) {
        newsLines.lines[newsLines.index].classList.add('active');
    }
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

export {initNewsLines, prevLine, nextLine, navigateFirst, navigateLast, navigateInto,
prepareNavigationList}
