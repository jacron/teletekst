const config = {
    /** load page 101, nieuwsoverzicht */
    teletekstUrl: 'https://nos.nl/teletekst#101_01',
};

let winId = null;

chrome.browserAction.onClicked.addListener(function() {
    if (winId === null) {
        /** prevent multiple popups */
        chrome.windows.create({
            url: config.teletekstUrl,
            type: 'popup',
            width: 600,
            height: 600,
            top: 10
        }, win => { });
    } else {
        chrome.windows.update(winId, {
            focused: true
        })
    }
});

chrome.windows.onRemoved.addListener(windowId => {
    if (windowId === winId) {
        winId = null;
        console.log('the popup closed');
    }
});

