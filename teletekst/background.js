const createData = {
    /** load page 101, nieuwsoverzicht */
    url: 'https://teletekst-data.nos.nl/webplus/?p=101-1',
    type: 'popup',
    width: 540,
    height: 625,
    left: 10,
    top: 40,
};
const activePopup = {
    windId: null,
    tabId: null
}

function calcLeft(w) {
    return screen.width / 2 - (w / 2);
}

chrome.browserAction.onClicked.addListener(function() {
    /** prevent multiple popups */
    if (!activePopup.winId) {
        createData.left = calcLeft(createData.width);
        chrome.windows.create(createData, win => {
            activePopup.tabId = win.tabs[0].id;
            activePopup.winId = win.id;
        });
    } else {
        chrome.windows.remove(activePopup.winId);
    }
});

chrome.tabs.onUpdated.addListener((id, tabChangeInfo) => {
    if (tabChangeInfo.status && tabChangeInfo.status === 'loading' &&
        id === activePopup.tabId) {
            chrome.tabs.executeScript(id, {
                file: 'scroll.js'
            }, () => {});
    }
});

chrome.windows.onRemoved.addListener(windowId => {
    if (windowId === activePopup.winId) {
        activePopup.winId = null;
        activePopup.tabId = null;
        // console.log('the popup closed');
    }
});

