const config = {
    /** load page 101, nieuwsoverzicht */
    teletekstUrl: 'https://nos.nl/teletekst#101_01',
};

chrome.browserAction.onClicked.addListener(function() {
    let tTabId;
    chrome.windows.create({
        url: config.teletekstUrl,
        type: 'popup',
        width: 600,
        height: 600
    }, win => {
        console.log('win', win);
        tTabId = win.tabs[0].id;
        chrome.tabs.executeScript(win.tabs[0].id, {
            file: 'scroll.js'
        }, () => {});
    });
    /** relad script after refresh of window */
    chrome.tabs.onUpdated.addListener((tabId, info) => {
        if (tabId === tTabId) {
            chrome.tabs.executeScript(tabId, {
                file: 'scroll.js'
            }, () => {});
        }
    });
});
