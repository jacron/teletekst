const config = {
    /** load page 101, nieuwsoverzicht */
    teletekstUrl: 'https://nos.nl/teletekst#101_01',
};

let winId = null;

chrome.browserAction.onClicked.addListener(function() {
    if (winId === null) {
        /** prevent multiple popups */
        let tTabId;
        chrome.windows.create({
            url: config.teletekstUrl,
            type: 'popup',
            width: 600,
            height: 600,
            top: 10
        }, win => {
            winId = win.id;
            tTabId = win.tabs[0].id;
            chrome.tabs.executeScript(win.tabs[0].id, {
                file: 'scroll.js'
            }, () => {
            });
        });
    } else {
        chrome.windows.update(winId, {
            focused: true
        })
    }
    /** reload script after window refresh */
    // chrome.tabs.onUpdated.addListener((tabId, info) => {
    //     if (tabId === tTabId) {
    //         chrome.tabs.executeScript(tabId, {
    //             file: 'scroll.js'
    //         }, () => {});
    //     }
    // });
});

chrome.windows.onRemoved.addListener(windowId => {
    if (windowId === winId) {
        winId = null;
        console.log('the popup closed');
    }
});

