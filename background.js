const config = {
    /** load page 101, nieuwsoverzicht */
    teletekstUrl: 'https://teletekst-data.nos.nl/webplus/?p=101-1',
};

let winId = null;
let tabId = null;

chrome.browserAction.onClicked.addListener(function() {
    if (winId === null) {
        /** prevent multiple popups */
        chrome.windows.create({
            url: config.teletekstUrl,
            type: 'popup',
            width: 540,
            height: 600,
            top: 10
        }, win => {
            tabId = win.tabs[0].id;
            winId = win.id;
        });
    } else {
        chrome.windows.remove(winId);
        // chrome.windows.update(winId, {
        //     focused: true
        // })
    }
});

chrome.tabs.onUpdated.addListener((id, info) => {
    if (info.status && info.status === 'loading' && id === tabId) {
            chrome.tabs.executeScript(tabId, {
                file: 'scroll.js'
            }, () => {
            });
    }
});

chrome.windows.onRemoved.addListener(windowId => {
    if (windowId === winId) {
        winId = null;
        tabId = null;
        console.log('the popup closed');
    }
});

