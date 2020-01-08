const config = {
    teletekstUrl: 'https://nos.nl/teletekst#101_01',
    JCSpecs: 'width=300,height=210,resizable=0,locationbar=0,top=100,left=100',
};

chrome.browserAction.onClicked.addListener(function(tab) {
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
