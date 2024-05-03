function openSidePanel() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, ([tab]) => {
        chrome.sidePanel.open({tabId: tab.id}).then();
    })
}

function commandListener(command) {
    switch (command) {
        case 'open-side-panel':
            openSidePanel();
            break;
    }
}

chrome.commands.onCommand.addListener(commandListener);
