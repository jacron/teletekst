const config = {
    teletekstUrl: 'https://nos.nl/teletekst#101_01',
};

chrome.browserAction.onClicked.addListener(function() {
    chrome.windows.create({
        url: config.teletekstUrl,
        type: 'popup',
        width: 600,
        height: 700
    }, win => {
        console.log('win', win);
        chrome.tabs.executeScript(win.tabs[0].id, {
            file: 'scroll.js'
        }, () => {

        });
    });
});
