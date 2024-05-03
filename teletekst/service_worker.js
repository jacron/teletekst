function openSidePanel() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, ([tab]) => {
        chrome.sidePanel.open({tabId: tab.id}).then();
    })
}

function closeSidePanel() {
    chrome.runtime.sendMessage({message: 'close-panel'}).then()
        .catch(err => console.error(err.message))
}

function commandListener(command) {
    switch (command) {
        case 'open-side-panel':
            openSidePanel();
            break;
        case 'close-side-panel':
            closeSidePanel();
            break;
    }
}

chrome.commands.onCommand.addListener(commandListener);
